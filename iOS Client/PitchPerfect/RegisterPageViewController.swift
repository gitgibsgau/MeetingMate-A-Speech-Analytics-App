//
//  RegisterPageViewController.swift
//  PitchPerfect
//
//  Created by Gaurav Shinde on 5/12/17.
//  Copyright © 2017 Alder. All rights reserved.
//

import UIKit

class RegisterPageViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var userEmailTextField: UITextField!
    @IBOutlet weak var passwordTextField: UITextField!
    @IBOutlet weak var confirmPasswordTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        confirmPasswordTextField.delegate = self;
        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func textFieldShouldReturn(_ confirmPasswordTextField: UITextField) -> Bool // called when 'return' key pressed. return NO to ignore.
    {
        confirmPasswordTextField.resignFirstResponder()
        return true;
    }
    
    @IBAction func registerButtonTapped(_ sender: Any) {
        let userEmail = userEmailTextField.text;
        let userPassword = passwordTextField.text;
        let userConfirmPassword = confirmPasswordTextField.text;
        
        //check for empty fields
        if((userEmail?.isEmpty)! || (userPassword?.isEmpty)! || (userConfirmPassword?.isEmpty)!){
            
            displayAlert(userMessage: "All fields are required!!");
            return;
        }
        
        if(userPassword != userConfirmPassword){
            
            displayAlert(userMessage: "Passwords do not match!!");
            return;
        }
        
        //store data
        UserDefaults.standard.set(userEmail, forKey: "uEmail");
        UserDefaults.standard.set(userPassword, forKey: "uPassword");
        UserDefaults.standard.synchronize();
        
        //display alert message with confirmation
        let myAlert = UIAlertController(title: "Alert", message: "Registration is successful. Thank you!!", preferredStyle: UIAlertControllerStyle.alert);
        
        let okAction = UIAlertAction(title: "Ok", style: UIAlertActionStyle.default){
            action in
            self.dismiss(animated: true, completion: nil);
        }
        
        myAlert.addAction(okAction);
        self.present(myAlert, animated: true, completion: nil);
        
    }
    
    func displayAlert(userMessage: String){
        let myAlert = UIAlertController(title: "Alert", message: userMessage, preferredStyle: UIAlertControllerStyle.alert);
        
        let okAction = UIAlertAction(title: "Ok", style: UIAlertActionStyle.default, handler: nil);
        
        myAlert.addAction(okAction);
        self.present(myAlert, animated: true, completion: nil);
    }

    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
