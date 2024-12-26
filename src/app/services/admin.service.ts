import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Book {
  id?: number;
  title: string;
  author: string;
  category: string;
  imageurl: string;
  description: string;
  isbn: string;
  status: boolean;
  stock: number;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = 'http://localhost:8082/api/books';

  constructor(private http: HttpClient) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.apiUrl);
  }

  getBookById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.apiUrl}/${id}`);
  }

  addBook(book: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, book);
  }

  updateBook(id: number, book: Book): Observable<Book> {
    return this.http.put<Book>(`${this.apiUrl}/${id}`, book);
  }

  deleteBook(id: number): Observable<void> {
    console.log(`Suppression du livre avec l'ID: ${id}`);
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  searchByTitle(keyword: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/searchByTitle?keyword=${keyword}`);
  }

  searchByAuthor(author: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/searchByAuthor?author=${author}`);
  }

  searchByCategory(category: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.apiUrl}/searchByCategory?category=${category}`);
  }
}
