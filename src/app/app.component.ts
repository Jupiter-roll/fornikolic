import { Component } from '@angular/core';

@Component({
    selector   : 'app-root',
    templateUrl: './app.component.html',
    styleUrls  : ['./app.component.scss']
})
export class AppComponent
{
    token  = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhY2NvdW50SWQiOiI1MGU0OTdkYS1kOTFjLTRiNDEtOWZkZi03MDcyYjcyZGJkMGEiLCJ1c2VySWQiOiJmNGRjZDg4OC04YTQwLTQ3OTYtOWFmYS02YmI1MmViZGM1ZGMiLCJzcGFjZUlkIjoiODZmZjc4NjYtZjg0Ny00NjI4LWI3NWMtNWYxYTc4ODk5YzM1IiwiaWF0IjoxNjIyODkyODk1LCJleHAiOjE2MjU0ODQ4OTUsImF1ZCI6ImF1ZGllbmNlIiwiaXNzIjoiMzY2IE9wbGVpZGluZ3NwbGF0Zm9ybSIsInN1YiI6ImluZm9AMzY2Lm5sIn0.1TgotQ0ZISPrqWw2-3ZMa5-3UM-BfPhLbIAwJVraYLw';
    /**
     * Constructor
     */
    constructor()
    {
        localStorage.setItem('token', this.token)
    };

    ngOnInit(): void {
        this.parseJWT();
    };

    parseJWT() {
        let base64Url = this.token.split('.')[1];
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        let jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        localStorage.setItem('userId', JSON.parse(jsonPayload)['userId'])
    }
}
