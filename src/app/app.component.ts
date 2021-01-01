import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit{

  constructor(private http: HttpClient, private cd: ChangeDetectorRef) {   
  }
  
  @ViewChild('container') container: ElementRef;
  @ViewChild('sound') sound: ElementRef;
  @ViewChild('icon') icon: ElementRef;
  @ViewChild('listening') listening: ElementRef;
  isListening: boolean = false;
  result: boolean = false;
  recognition:any;
  paragraph: any;
  synth: any;
  items:string[]=[];

  ngOnInit(){
    this.recognition = new SpeechRecognition();
    this.recognition.continous = true;
    this.recognition.interimResults = false;
    this.synth = window.speechSynthesis;
    this.listening.nativeElement.textContent = "Please press microphone to start speaking";
   }

  title = 'TextConverter';

  iconClick = (event) =>{
    if(!this.isListening){
      this.isListening = true;
      this.result = false;
      this.listening.nativeElement.hidden = false;
      this.listening.nativeElement.textContent = "Listening...";
      this.dictate();
    }
  }

  addItems = (newItem) =>{
    this.items.push(newItem);
    this.cd.detectChanges();
  }

  dictate = ()=>{
    var me = this;
    this.recognition.start();
    this.recognition.onresult = (event) => {
      this.result = true;
      this.listening.nativeElement.textContent = "User said...";
      let speechToText:string = event.results[0][0].transcript;
      me.addItems(speechToText);
      me.reset();

      // if(event.results[0].isFinal){
      //   if(speechToText.includes('spell')){
      //     this.speak(speechToText);
      //   }
      //   if(speechToText.includes('how are you')){
      //     this.speak('I am good, thank you! What can I help you with?');
      //   }
      //   if(speechToText.includes('lakshmi')){
      //     this.speak('she is a great devotee and an awesome singer');
      //   }
      //   if(speechToText.includes('time')){
      //     if((!speechToText.includes('not') && !speechToText.includes("don't"))){
      //     let time = new Date();
      //     time.toLocaleTimeString();
      //     this.speak('the time is '+time.toTimeString().split(" ")[0]);
      //     } else {
      //       this.speak('Ok your wish');
      //     }
      //   }
      //   if(speechToText.includes('weather in')){
      //     var me=this;
      //     var arr = speechToText.split('weather in');
      //     var city = arr[arr.length-1];
      //     this.http.get('http://api.weatherstack.com/current?access_key=bcf9cc373dfd03345c7c651236e27499&query='+city).subscribe(function(response){
      //       if(response){
      //         me.speak("Weather in "+city+" is "+response["current"].weather_descriptions);
      //       }
      //     });
      //     //bcf9cc373dfd03345c7c651236e27499
      //   }
      // }
    }
    this.recognition.onend = (event)=>{
      if(!this.result){
        me.reset();
        this.listening.nativeElement.textContent = "No Input, try again!";
      }
    }
  }
  reset=()=>{
    this.isListening = false;
    this.cd.detectChanges();
  }
  close=()=>{
    this.reset();
    this.listening.nativeElement.textContent = "";
  }

  speak=(action)=>{
    let utterThis = new SpeechSynthesisUtterance(action);
    this.synth.speak(utterThis);
  }
}


