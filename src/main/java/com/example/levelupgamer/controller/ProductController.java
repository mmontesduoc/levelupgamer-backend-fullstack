package com.example.levelupgamer.controller;

import com.example.levelupgamer.model.Product;
import com.example.levelupgamer.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@RequiredArgsConstructor
@Tag(name = "Products", description = "APIs para gestión de productos")
public class ProductController {
    private final ProductService service;

    @GetMapping
    @Operation(summary = "Listar productos", description = "Devuelve la lista completa de productos")
    public List<Product> all() {
        return service.findAll();
    }

    @GetMapping("/category/{id}")
    @Operation(summary = "Listar por categoría", description = "Devuelve productos filtrados por id de categoría")
    public List<Product> byCategory(@PathVariable Long id) {
        return service.findByCategory(id);
    }

    @PostMapping
    @Operation(summary = "Crear producto", description = "Crea un nuevo producto")
    public Product create(@RequestBody Product p) {
        return service.save(p);
    }

    @PutMapping("/{id}")
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente por id")
    public Product update(@PathVariable Long id, @RequestBody Product p) {
        return service.update(id, p);
    }

    @DeleteMapping("/{id}")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto por id")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}