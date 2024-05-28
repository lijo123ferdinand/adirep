package com.example.capstone.expense.repository;

import java.util.Collection;
import java.util.Optional;
import java.util.List;

// import org.hibernate.mapping.List;
import org.springframework.data.jpa.repository.JpaRepository;
import com.example.capstone.expense.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
		
	User findByUsername(String username);

    User findByEmail(String email);

    Optional<User> findById(Long id);	
        List<User> findByParentId(Long parentId); // Add this method
	
}