package com.usermanagement.app.service;

import com.usermanagement.app.entity.ManagedUser;
import com.usermanagement.app.repository.ManagedUserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ManagedUserService {

    private final ManagedUserRepository repo;

    public ManagedUserService(ManagedUserRepository repo) {
        this.repo = repo;
    }

    // Add a new user under a specific admin
    public ManagedUser addUser(String name, String email, Long adminId){

        if(name == null || name.trim().isEmpty()){
            throw new RuntimeException("Name is required");
        }

        if(email == null || email.trim().isEmpty()){
            throw new RuntimeException("Email is required");
        }

        if(repo.existsByEmailIgnoreCaseAndAdminId(email, adminId)){
            throw new RuntimeException("User email already exists for this admin");
        }

        ManagedUser user = new ManagedUser();
        user.setName(name);
        user.setEmail(email);
        user.setAdminId(adminId);

        return repo.save(user);
    }

    // Fetch all users under an admin
    public List<ManagedUser> listUsers(Long adminId){
        return repo.findByAdminId(adminId);
    }

    // Delete user by id (only under same admin)
    public void deleteUser(Long id, Long adminId){

        ManagedUser user = repo.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if(!user.getAdminId().equals(adminId)){
            throw new RuntimeException("Unauthorized delete attempt");
        }

        repo.delete(user);
    }
}
