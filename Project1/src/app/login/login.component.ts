import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
  value1: number = 0;
  value2: number = 0;
  userAnswer: number = 0;
  correctAnswer: number = 0;
  id:String="";
  password:String="";
  institution_name:String="";

  

  ngOnInit(): void {
    this.generateCaptcha();
  }


  generateCaptcha(): void {
    this.value1 = this.getRandomNumber();
    this.value2 = this.getRandomNumber();
    this.correctAnswer = this.value1 + this.value2;
  }

  
  getRandomNumber(): number {
    return Math.floor(Math.random() * 10) + 1;
  }


  loginObj = {
    id: '',
    password: '',
    institution_name: ''
  };

  http=inject(HttpClient);

  constructor(private router:Router) {

  }

  onLogin(id: string):void{
    localStorage.setItem('userId',id);
    this.router.navigateByUrl("dashboard");

  }


  validateAnswer(): void {
    console.log("validating");
    if (this.userAnswer === this.correctAnswer) {
      this.http.get("http://localhost:8080/check/id/"+this.id+"/"+this.password).subscribe((res:any)=>{
        console.log(res)
        if(res==null){
          alert('Invalid UserID or Password');
          console.log(res)
        }else{
          //this.router.navigateByUrl("dashboard")
        this.onLogin(res.id);
        console.log(res)
        console.log(this.loginObj)
        }
        
  
      })
    } else {
      alert('Incorrect Answer! Please try again.');
      this.generateCaptcha(); 
    }
    this.userAnswer = 0; 

    
  }


}
