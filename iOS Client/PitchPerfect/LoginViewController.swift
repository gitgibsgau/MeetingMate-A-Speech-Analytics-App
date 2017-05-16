//
//  LoginViewController.swift
//  PitchPerfect
//
//  Created by Gaurav Shinde on 5/12/17.
//  Copyright © 2017 Alder. All rights reserved.
//

import UIKit

class LoginViewController: UIViewController, UITextFieldDelegate {

    @IBOutlet weak var userEmailTextField: UITextField!
    @IBOutlet weak var userPasswordTextField: UITextField!
    
    override func viewDidLoad() {
        super.viewDidLoad()
        userEmailTextField.delegate = self;
        userPasswordTextField.delegate = self;
        // Do any additional setup after loading the view.
    }
    
    func textFieldShouldReturn(_ userPasswordTextField: UITextField) -> Bool // called when 'return' key pressed. return NO to ignore.
    {
        userPasswordTextField.resignFirstResponder()
        return true;
    }
    

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

    @IBAction func loginButtonTapped(_ sender: Any) {
        print("in login");
        let uEmail = userEmailTextField.text;
        let uPassword = userPasswordTextField.text;
        
        let uEmailStored = UserDefaults.standard.string(forKey: "uEmail");
        let uPasswordStored = UserDefaults.standard.string(forKey: "uPassword");
        
        if(uEmailStored == uEmail){
            
            if(uPasswordStored == uPassword){
                
                UserDefaults.standard.set(true, forKey: "isUserLoggedIn");
                UserDefaults.standard.synchronize();
                //self.dismiss(animated: true, completion: nil);
                self.performSegue(withIdentifier: "loginView", sender: self);

            }
        }

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
