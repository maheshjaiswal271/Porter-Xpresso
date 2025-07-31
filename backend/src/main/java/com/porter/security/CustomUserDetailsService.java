package com.porter.security;

import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Primary;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.porter.model.Porter;
import com.porter.model.User;
import com.porter.repository.PorterRepository;
import com.porter.repository.UserRepository;

@Service
@Primary
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PorterRepository porterRepository;

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        User user = userRepository.findByUsername(username)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with username: " + username));

        // Block login if not verified
        if (!user.isVerified()) {
            throw new UsernameNotFoundException("User email/OTP not verified");
        }
        // If porter, block if not approved
        if (user.getRole().name().equals("PORTER")) {
            Porter porter = porterRepository.findByName(user.getUsername()).orElse(null);
            if (porter != null && (!porter.isVerified() || !"APPROVED".equalsIgnoreCase(porter.getStatus()))) {
                throw new UsernameNotFoundException("Porter not approved by admin or not verified");
            }
        }

        return new org.springframework.security.core.userdetails.User(
                user.getUsername(),
                user.getPassword(),
                Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + user.getRole().name()))
        );
    }
} 