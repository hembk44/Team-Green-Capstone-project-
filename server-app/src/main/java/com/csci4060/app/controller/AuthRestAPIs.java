package com.csci4060.app.controller;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashSet;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.Set;


import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import javax.validation.Valid;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;

import org.springframework.mail.SimpleMailMessage;
import org.springframework.security.access.method.P;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import org.springframework.web.servlet.ModelAndView;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.csci4060.app.ExceptionResolver;
import com.csci4060.app.configuration.jwt.JwtProvider;
import com.csci4060.app.model.APIresponse;
import com.csci4060.app.model.Role;
import com.csci4060.app.model.RoleName;
import com.csci4060.app.model.User;
import com.csci4060.app.model.authentication.ConfirmationToken;
import com.csci4060.app.model.authentication.JwtResponse;
import com.csci4060.app.model.authentication.LoginForm;
import com.csci4060.app.model.authentication.SignUpForm;
import com.csci4060.app.model.calendar.Calendar;
import com.csci4060.app.services.CalendarService;
import com.csci4060.app.services.ConfirmationTokenService;
import com.csci4060.app.services.EmailSenderService;
import com.csci4060.app.services.RoleService;
import com.csci4060.app.services.UserService;

/*
 *  AuthRestAPIs.java defines 2 APIs:

/api/auth/signup: sign up
-> check username/email is already in use.
-> create User object
-> store to database
/api/auth/signin: sign in
-> attempt to authenticate with AuthenticationManager bean.
-> add authentication object to SecurityContextHolder
-> Generate JWT token, then return JWT to client

 */

@CrossOrigin(origins = "*", maxAge = 3600)
@RestController
@RequestMapping("/api/auth")
public class AuthRestAPIs extends ExceptionResolver {

	@Autowired
	AuthenticationManager authenticationManager;

	@Autowired
	UserService userService;

	@Autowired
	RoleService roleService;

	@Autowired
	ConfirmationTokenService confirmationTokenService;

	@Autowired
	private EmailSenderService emailSenderService;

	@Autowired
	PasswordEncoder encoder;

	@Autowired
	JwtProvider jwtProvider;
	
	@Autowired
	CalendarService calendarService;

	@PostMapping("/signin")
	public APIresponse authenticateUser(@Valid @RequestBody LoginForm loginRequest) {

		User user = userService.findByUsername(loginRequest.getUsername());


		if (user.isVerified()) {

			Authentication authentication = authenticationManager.authenticate(
					new UsernamePasswordAuthenticationToken(loginRequest.getUsername(), loginRequest.getPassword()));
			SecurityContextHolder.getContext().setAuthentication(authentication);
			String jwt = jwtProvider.generateJwtToken(authentication);

			String role = "";

			@SuppressWarnings("unchecked")
			List<GrantedAuthority> authorities = (List<GrantedAuthority>) authentication.getAuthorities();

			for (GrantedAuthority authority : authorities) {
				role = authority.toString();
			}
		

			
			return new APIresponse(HttpStatus.OK.value(), "Successful", new JwtResponse(jwt, loginRequest.getUsername(),role));
		    }
		

		return new APIresponse(HttpStatus.FORBIDDEN.value(), "Please click on the verification link to login", null);

	}

	@PostMapping("/signup")
	public APIresponse registerUser(@Valid @RequestBody SignUpForm signUpRequest) {
		if (userService.existsByUsername(signUpRequest.getUsername())) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Fail -> Username is already taken!", null);
		}

		if (userService.existsByEmail(signUpRequest.getEmail())) {
			return new APIresponse(HttpStatus.BAD_REQUEST.value(), "Fail -> Email is already in use!", null);
		}

		
		// Creating user's account
		User user = new User(signUpRequest.getName(), signUpRequest.getUsername(), signUpRequest.getEmail(),
				encoder.encode(signUpRequest.getPassword()), signUpRequest.isVerified());

		Set<String> strRoles = signUpRequest.getRole();
		Set<Role> roles = new HashSet<>();

		for (String each : strRoles) {

			if (each.equals("admin")) {
				Role adminRole = roleService.findByName(RoleName.ROLE_ADMIN);
				roles.add(adminRole);
			} else if (each.equals("pm")) {
				Role pmRole = roleService.findByName(RoleName.ROLE_PM);
				roles.add(pmRole);
			} else {
				Role userRole = roleService.findByName(RoleName.ROLE_USER);
				roles.add(userRole);
			}
		}

		user.setRoles(roles);
		
		userService.save(user);
		
		calendarService.save(new Calendar("Main", null, null, user, true, true));
		calendarService.save(new Calendar("Appointment", null, null, user, true, true));
		calendarService.save(new Calendar("Shared Event", null, null, user, true, true));
		
		

		ConfirmationToken confirmationToken = new ConfirmationToken(user);

		confirmationTokenService.save(confirmationToken);

		SimpleMailMessage mailMessage = new SimpleMailMessage();
		mailMessage.setTo(user.getEmail());
		mailMessage.setSubject("Complete Registration!");
		mailMessage.setFrom("ulmautoemail@gmail.com");
		mailMessage.setText("To confirm your account, please click here : "
				+ "http://localhost:8181/api/auth/confirm-account/" + confirmationToken.getConfirmationToken());

		emailSenderService.sendEmail(mailMessage);

		return new APIresponse(HttpStatus.OK.value(),
				"Verification code has been sent to you email address. Please click it to register successfully.",
				null);
	}

	@GetMapping("/confirm-account/{token}")
	public String confirmUserAccout(@PathVariable("token") String confirmationToken) {
		ConfirmationToken token = confirmationTokenService.findByConfirmationToken(confirmationToken);

		if (token != null) {
			return "emailVerification.html";
		} else {
			return null;
		}
	}

	@PostMapping("/delete/{email}")
	public void deleteUser(@PathVariable("email") String email) {
		
		userService.delete(email);
		
		
	}
	
//	@PostMapping(path = "verifyEmail", produces = "application/json")
//	public APIresponse verifyEmail(@RequestBody Map<String,String> emailJson) {
//		
//		String email = emailJson.get(email);
//		System.out.println("The email is: "+ emailJson.get(email));
//		
//		String baseUrl = ServletUriComponentsBuilder.fromCurrentContextPath().build().toUriString();
//		
//		User user = userService.findByEmail(email);
//		System.out.println(user);
//		if (user != null) {
//			ConfirmationToken token = new ConfirmationToken(user);
//			confirmationTokenService.save(token);
//
//			SimpleMailMessage mailMessage = new SimpleMailMessage();
//			mailMessage.setTo(email);
//			mailMessage.setSubject("Verify Email");
//			mailMessage.setFrom("ulmautoemail@gmail.com");
//			mailMessage.setText("To confirm your account, please click here : " + baseUrl + "api/auth/confirm-account/"
//					+ token.getConfirmationToken());
//
//			emailSenderService.sendEmail(mailMessage);
//
//			return new APIresponse(HttpStatus.OK.value(), "VerificationToken has been sent for " + user.getUsername(),
//					null);
//		}
//		return new APIresponse(HttpStatus.UNAUTHORIZED.value(), "User email is not in the database", null);
//	}
	
	
	@PostMapping(value = "/forgot")
	public APIresponse processForgotPasswordForm(@Valid @RequestParam("email") String userEmail, HttpServletRequest request) {

		// Lookup user in database by e-mail
		User user = userService.findByEmail(userEmail);

		if (user == null) {
			return new APIresponse(HttpStatus.NOT_FOUND.value(),"Requested user for given email is not found. Please sign up!", null);
		} else {
			
			ConfirmationToken token = new ConfirmationToken(user);
     		confirmationTokenService.save(token);

			String appUrl = request.getScheme() + "://" + request.getServerName();
			
			SimpleMailMessage mailMessage = new SimpleMailMessage();
			mailMessage.setTo(user.getEmail());
			mailMessage.setSubject("Verify Email");
			mailMessage.setFrom("ulmautoemail@gmail.com");
			mailMessage.setText("Here is the link to reset your password:\n"
					+ appUrl + ":8181/api/auth/"+ confirmationTokenService.findByUser(user).getConfirmationToken());

			emailSenderService.sendEmail(mailMessage);

			// Add success message to view
			return new APIresponse(HttpStatus.OK.value(),"A link has been sent to your email, please follow the link to reset your password!", null);		
		}


	}
	
	
	@GetMapping(value = "/{resetToken}")
    public ModelAndView displayResetPasswordPage(@PathVariable("resetToken") String token)  {
        
        ConfirmationToken resettoken = confirmationTokenService.findByConfirmationToken(token);
        ModelAndView modelAndView = new ModelAndView();
       try {
            if (!(resettoken.getCreatedDate()).after(new Date())) {
            	System.out.println("True");
               modelAndView.addObject("resetToken", token);
               modelAndView.setViewName("redirect:http://localhost:4200/reset-password");
            } else {
            	System.out.println("false");
                modelAndView.addObject("errorMessage", "Oops!  Your password reset link has expired.");
               modelAndView.setViewName("redirect:http://localhost:4200/forgot-password");
            }
        } catch(RuntimeException e) {
           modelAndView.addObject("errorMessage", "Oops!  This is an invalid password reset link.");
           modelAndView.setViewName("redirect:http://localhost:4200/forgot-password");
        }
        return modelAndView;
    }
	
	
	@PostMapping(value = "/processResetPassword")
    public ModelAndView setNewPassword(@Valid @RequestBody Map<String, String> requestParams, RedirectAttributes redir, HttpServletResponse response) {
        
        ConfirmationToken resetToken = confirmationTokenService.findByConfirmationToken(requestParams.get("resetToken"));
        User resetUser = resetToken.getUser();
        ModelAndView modelAndView = new ModelAndView();
      try {
           System.out.println("true");
           System.out.println(resetToken.getConfirmationToken());
            resetUser.setPassword(encoder.encode(requestParams.get("password")));
            userService.save(resetUser);
            
            confirmationTokenService.delete(resetToken);
          
            //redir.addFlashAttribute("successMessage", "You have successfully reset your password. You may now login.");
            //modelAndView.addObject("successMessage", "You have successfully reset your password. You may now login.");
           modelAndView.setViewName("redirect:http://localhost:4200");
            return modelAndView;
        } catch (RuntimeException e){
            modelAndView.addObject("errorMessage", "Oops!  This is an invalid password reset link.");
            modelAndView.setViewName("redirect:http://localhost:4200/forgot-password");
        }
        return modelAndView;
    }


}
