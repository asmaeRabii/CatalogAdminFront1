import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AdminService, Book } from '../../services/admin.service';

@Component({
  selector: 'app-book-list',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './admin-book-list.component.html',
  styleUrls: ['./admin-book-list.component.css']
})
export class AdminBookListComponent implements OnInit {
  books: Book[] = [];
  searchTerm: string = '';
  searchCategory: string = 'title';
  searchExecuted: boolean = false;
  booksBeforeSearch: Book[] = [];
  isModalOpen: boolean = false;
  isMessageModalOpen: boolean = false;
  message: string | null = null;
  isSuccess: boolean = false;
  isDeleteConfirmationOpen: boolean = false;
  selectedBook: Book | null = null;
  isEditModalOpen: boolean = false;
  bookToEdit: Book | null = null;

  newBook: Book = {
    title: '',
    author: '',
    category: '',
    imageurl: '',
    description: '',
    isbn: '',
    status: true,
    stock: 1
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadBooks();
  }

  loadBooks(): void {
    this.adminService.getAllBooks().subscribe(data => {
      this.books = data;
      this.booksBeforeSearch = [...data];
    });
  }

  refreshCurrentView(): void {
    if (this.searchTerm.trim() !== '') {
      this.performSearch();
    } else {
      this.loadBooks();
    }
  }

  searchBooks(): void {
    this.searchExecuted = true;
    if (this.searchTerm.trim() !== '') {
      this.performSearch();
    } else {
      this.books = [...this.booksBeforeSearch];
    }
  }

  performSearch(): void {
    const searchBy = this.searchCategory;
    const searchTerm = this.searchTerm.trim();
    if (searchBy === 'title') {
      this.adminService.searchByTitle(searchTerm).subscribe((books) => {
        this.books = books;
      });
    } else if (searchBy === 'author') {
      this.adminService.searchByAuthor(searchTerm).subscribe((books) => {
        this.books = books;
      });
    } else if (searchBy === 'category') {
      this.adminService.searchByCategory(searchTerm).subscribe((books) => {
        this.books = books;
      });
    }
  }

  openAddBookModal(event: Event): void {
    event.preventDefault();
    this.isModalOpen = true;
  }

  closeAddBookModal(): void {
    this.isModalOpen = false;
    this.resetNewBook();
  }

  resetNewBook(): void {
    this.newBook = {
      title: '',
      author: '',
      category: '',
      imageurl: '',
      description: '',
      isbn: '',
      status: true,
      stock: 1
    };
  }

  submitBook(event: Event): void {
    event.preventDefault();
    console.log('Livre soumis:', this.newBook);

    this.adminService.addBook(this.newBook).subscribe(
      (response) => {
        console.log('Livre ajouté:', response);
        this.isModalOpen = false;
        this.refreshCurrentView();
        this.resetNewBook();

        this.message = 'Livre ajouté avec succès!';
        this.isSuccess = true;
        this.isMessageModalOpen = true;

        setTimeout(() => {
          this.isMessageModalOpen = false;
        }, 2000);
      },
      (error) => {
        console.error('Erreur lors de l\'ajout du livre:', error);
        this.message = 'Erreur lors de l\'ajout du livre.';
        this.isSuccess = false;
        this.isMessageModalOpen = true;

        setTimeout(() => {
          this.isMessageModalOpen = false;
        }, 2000);
      }
    );
  }

  openDeleteConfirmationModal(book: Book): void {
    console.log('Livre sélectionné pour suppression:', book);
    this.selectedBook = book;
    this.isDeleteConfirmationOpen = true;
  }

  closeDeleteConfirmationModal(): void {
    this.isDeleteConfirmationOpen = false;
    this.selectedBook = null;
  }

  deleteBook(): void {
    if (this.selectedBook && this.selectedBook.id !== undefined) {
      console.log('Suppression du livre avec ID:', this.selectedBook.id);
      this.adminService.deleteBook(this.selectedBook.id).subscribe(
        (response) => {
          console.log('Livre supprimé:', response);
          this.refreshCurrentView();
          this.closeDeleteConfirmationModal();

          this.message = 'Livre supprimé avec succès!';
          this.isSuccess = true;
          this.isMessageModalOpen = true;

          setTimeout(() => {
            this.isMessageModalOpen = false;
          }, 2000);
        },
        (error) => {
          console.error('Erreur lors de la suppression du livre:', error);
          this.closeDeleteConfirmationModal();

          this.message = 'Erreur lors de la suppression du livre.';
          this.isSuccess = false;
          this.isMessageModalOpen = true;

          setTimeout(() => {
            this.isMessageModalOpen = false;
          }, 2000);
        }
      );
    } else {
      console.error('ID du livre manquant');
    }
  }

  openEditBookModal(book: Book): void {
    this.bookToEdit = { ...book }; // Copie des données du livre pour éviter la modification accidentelle
    this.isEditModalOpen = true; // Ouvre le modal
  }


  closeEditBookModal(): void {
    this.isEditModalOpen = false;
    this.bookToEdit = null;
  }

  closeMessageModal(): void {
    this.isMessageModalOpen = false;
  }

  editBook(event: Event): void {
    event.preventDefault();
    console.log('Modifier un livre');
  }
  submitEditBook(event: Event): void {
    event.preventDefault();
    if (this.bookToEdit && this.bookToEdit.id) {
      this.adminService.updateBook(this.bookToEdit.id, this.bookToEdit).subscribe(
        (response) => {
          console.log('Livre modifié:', response);
          this.isEditModalOpen = false;
          this.refreshCurrentView(); // Rafraîchir la vue pour afficher les modifications
          this.bookToEdit = null;

          this.message = 'Livre modifié avec succès!';
          this.isSuccess = true;
          this.isMessageModalOpen = true;

          setTimeout(() => {
            this.isMessageModalOpen = false;
          }, 2000);
        },
        (error) => {
          console.error('Erreur lors de la modification du livre:', error);
          this.message = 'Erreur lors de la modification du livre.';
          this.isSuccess = false;
          this.isMessageModalOpen = true;

          setTimeout(() => {
            this.isMessageModalOpen = false;
          }, 2000);
        }
      );
    }
  }

}
