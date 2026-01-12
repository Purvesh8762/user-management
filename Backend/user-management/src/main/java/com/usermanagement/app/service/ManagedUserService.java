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

    // Add user for a specific admin
    public ManagedUser addUser(String name, String email, Long adminId){

        ManagedUser u = new ManagedUser();
        u.setName(name);
        u.setEmail(email);
        u.setAdminId(adminId);

        return repo.save(u);
    }

    // List users for a specific admin
    public List<ManagedUser> listUsers(Long adminId){
        return repo.findByAdminId(adminId);
    }

    // Delete user
    public void deleteUser(Long id){
        repo.deleteById(id);
    }
}
