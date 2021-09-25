import { Component, OnInit } from '@angular/core';
import { first } from 'rxjs/operators';
import { User } from 'src/app/models/User';
import { AuthService } from 'src/app/services/auth.service';


@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  currentUser: User;

  constructor(private auth: AuthService) {

  }

  ngOnInit(): void {
    this.currentUser = this.auth.currentUserValue;
  }

  refresh(): void {
    window.location.reload();
  }

  onLogout(){
    this.auth.logout();                      // {3}
  }
}
