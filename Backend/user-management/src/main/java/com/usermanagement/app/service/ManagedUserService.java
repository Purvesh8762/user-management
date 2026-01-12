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

        // Optional check to avoid duplicate email
        if(repo.findByEmail(email).isPresent()){
            throw new RuntimeException("User email already exists");
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


    // Delete user by id
    public void deleteUser(Long id){

        if(!repo.existsById(id)){
            throw new RuntimeException("User not found");
        }

        repo.deleteById(id);
    }
}
