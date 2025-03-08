package com.delivery.deliveryApp.controller;

import com.delivery.deliveryApp.model.FoodItem;
import com.delivery.deliveryApp.model.Menu;
import com.delivery.deliveryApp.model.Restaurant;
import com.delivery.deliveryApp.repository.FoodItemRepository;
import com.delivery.deliveryApp.repository.MenuRepository;
import com.delivery.deliveryApp.repository.RestaurantRepository;
import com.delivery.deliveryApp.dto.MenuRequestDTO;
import com.delivery.deliveryApp.dto.MenuResponseDTO;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.BindingResult;
import org.springframework.web.bind.annotation.*;

import jakarta.validation.Valid;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/menus")
public class MenuController {

    @Autowired
    private MenuRepository menuRepository;

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private FoodItemRepository foodItemRepository;

    @Autowired
    private ModelMapper modelMapper;

    @PostMapping
    public ResponseEntity<?> createMenu(@Valid @RequestBody MenuRequestDTO menuRequestDTO, BindingResult bindingResult) {
        if (bindingResult.hasErrors()) {
            return ResponseEntity.badRequest().body(bindingResult.getAllErrors());
        }

        Optional<Restaurant> optionalRestaurant = restaurantRepository.findById(menuRequestDTO.getRestaurantId());
        if (optionalRestaurant.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Restaurant not found");
        }
        Restaurant restaurant = optionalRestaurant.get();

        Menu menu = modelMapper.map(menuRequestDTO, Menu.class);
        menu.setRestaurant(restaurant);
        
        Menu savedMenu = menuRepository.save(menu);
        MenuResponseDTO menuResponseDTO = modelMapper.map(savedMenu, MenuResponseDTO.class);
        return ResponseEntity.status(HttpStatus.CREATED).body(menuResponseDTO);
    }

    @GetMapping("/restaurant/{restaurantId}")
    public ResponseEntity<?> getMenusByRestaurant(@PathVariable Long restaurantId) {
        List<Menu> menus = menuRepository.findByRestaurantId(restaurantId);
        List<MenuResponseDTO> menuResponseDTOs = menus.stream()
                .map(menu -> modelMapper.map(menu, MenuResponseDTO.class))
                .collect(Collectors.toList());
        return ResponseEntity.ok(menuResponseDTOs);
    }

    @PostMapping("/{menuId}/add-food-item/{foodItemId}")
    public ResponseEntity<?> addFoodItemToMenu(@PathVariable Long menuId, @PathVariable Long foodItemId) {
        Optional<Menu> optionalMenu = menuRepository.findById(menuId);
        if (optionalMenu.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Menu not found");
        }
        Menu menu = optionalMenu.get();

        Optional<FoodItem> optionalFoodItem = foodItemRepository.findById(foodItemId);
        if (optionalFoodItem.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Food item not found");
        }
        FoodItem foodItem = optionalFoodItem.get();

        menu.getFoodItems().add(foodItem);
        menuRepository.save(menu);

        return ResponseEntity.ok("Food item added to menu successfully");
    }
}
