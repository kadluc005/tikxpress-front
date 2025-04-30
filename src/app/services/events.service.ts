import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { CreateEventDto, Event } from '../models/event';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  constructor(private http: HttpClient) { }
  private baseUrl = environment.BASE_API_URL + 'events/';

  private getAuthHeaders(token: string): HttpHeaders {
    return new HttpHeaders({
      Authorization: `Bearer ${token}`
    });
  }

  createEvent(jwtToken: string, event: CreateEventDto): Observable<Event>{
    const headers = this.getAuthHeaders(jwtToken);
    return this.http.post<Event>(this.baseUrl+'create', event, {headers: headers});

  }

  updateEvent(jwtToken: string, eventId: number, event: CreateEventDto): Observable<Event>{
    const headers = this.getAuthHeaders(jwtToken);

    return this.http.patch<Event>(this.baseUrl+ eventId, event, {headers: headers});
  }

  deleteEvent(jwtToken: string, eventId: number): Observable<any> {
    const headers = this.getAuthHeaders(jwtToken);
    return this.http.delete<any>(this.baseUrl + eventId, { headers });
  }

  getAllEvents(): Observable<Event[]>{
    return this.http.get<Event[]>(this.baseUrl);
  }

  getEventById(eventId: number): Observable<Event> {
    return this.http.get<Event>(this.baseUrl + eventId);
  }
}
