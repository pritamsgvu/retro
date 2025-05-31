import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterOutlet, RouterModule, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, CommonModule, RouterModule],
  templateUrl: './app.component.html'

})
export class AppComponent implements OnInit {
  isSidebarOpen = false;
  isLoggedIn = false;
  isNavbarCollapsed = false;
  barberMenuOpen: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const userLoggedIn = localStorage.getItem('token');
    // if (userLoggedIn) {
    //   this.isLoggedIn = true;
    // } else {
    //   this.router.navigate(['']);
    // }


    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.isLoggedIn = !!localStorage.getItem('token');
      }
    });

    console.log('isLoggedIn', this.isLoggedIn);
  }

  // Toggle the visibility of the Barber Management sub-menu
  toggleBarberMenu() {
    this.barberMenuOpen = !this.barberMenuOpen;
  }
  toggleNavbar() {
    this.isNavbarCollapsed = !this.isNavbarCollapsed;
  }

  logout() {
    localStorage.setItem('token', '');
    localStorage.setItem('user', '');
    this.router.navigate(['/login']);
    this.isLoggedIn = false;
  }

}

