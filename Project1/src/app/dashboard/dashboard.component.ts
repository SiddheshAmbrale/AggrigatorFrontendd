import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, RouterOutlet, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent {
  searchTerm: string = '';
  records: Array<{ id: number; name: string; status: string; date: string }> = [];
  filteredRecords: Array<{ id: number; name: string; status: string; date: string }> = [];
  paginatedRecords: Array<{ id: number; name: string; status: string; date: string }> = [];
  recordCount: number = 0;
  currentPage: number = 1;
  itemsPerPage: number = 10;
  userid: string = ''; // Corrected property to store the user ID

  http = inject(HttpClient);

  constructor() {
    this.filteredRecords = this.records;
    this.recordCount = this.records.length;
    this.updatePaginatedRecords();
  }

  ngOnInit(): void {
    // Retrieve user ID from localStorage and assign it to this.userid
    this.userid = localStorage.getItem('userId') || '';
    console.log('User ID from localStorage:', this.userid);

    if (this.userid) {
      this.getConsent(this.userid);
    } else {
      console.error('User ID not found in localStorage.');
    }
  }

  applySearch() {
    if(this.searchTerm){
      this.filteredRecords = this.records.filter(record =>
        record.name.toLowerCase().includes(this.searchTerm.toLowerCase())
      );
    }else{
      this.filteredRecords = this.records;
    }
    this.recordCount = this.filteredRecords.length;
    this.currentPage = 1;
    this.updatePaginatedRecords();
  }

  addNewRecord() {
    const newRecordId = this.records.length + 1;
    const newRecord = {
      id: newRecordId,
      name: `Record ${newRecordId}`,
      status: 'Active',
      date: new Date().toISOString().split('T')[0]
    };
    this.records.push(newRecord);
    this.applySearch();
  }

  get totalPages(): number {
    return Math.ceil(this.filteredRecords.length / this.itemsPerPage);
  }

  updatePaginatedRecords() {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    this.paginatedRecords = this.filteredRecords.slice(start, end);
  }

  changePage(page: number) {
    if (page >= 1 && page <= this.totalPages) {
      this.currentPage = page;
      this.updatePaginatedRecords();
    }
  }

  /*getConsent(userid: string): void {
    // Use the passed `userid` directly in the URL
    const url = `http://localhost:8080/dashboard/id/${userid}`;
    this.http.get(url).subscribe(
      (res: any) => {
        console.log('Response from getConsent:', res);
      },
      (error) => {
        console.error('Error fetching consent:', error);
      }
    );
  }*/

    /*getConsent(userid: string): void {
      const url = `http://localhost:8080/institution/id/${userid}`;
      this.http.get<any>(url).subscribe(
        (res) => {
          console.log('Response from getConsent:', res);
          console.log(this.records);
    
          // Normalize res to an array if it's not already
          const newRecords = Array.isArray(res) ? res : [res];
    
          // Map the records to your expected structure
          const formattedRecords = newRecords.map((item) => ({
            id: item.consentId,
            name: `Institution ${item.institutionId}`,
            status: item.consentStatus,
            date: new Date(item.consentDate).toISOString().split('T')[0],
          }));
    
          // Update the records with a new reference
          this.records = [...this.records, ...formattedRecords];
          this.applySearch(); // Update the UI
        },
        (error) => {
          console.error('Error fetching consent:', error);
        }
      );
    }*/
      getConsent(userid: string): void {
        const url = `http://localhost:8080/dashboard/all-records/111`;
        this.http.get<any>(url).subscribe(
          (res) => {
            console.log('Response from API:', res);
            this.records = res;
            // Map the response to the expected structure of your records
            // const newRecord = {
            //   id: res.institutionID, // Map institutionID to id
            //   name: res.institutionName, // Use institutionName as the name
            //   status: 'Active', // Default status to 'Active'
            //   date: 'N/A', // No date available in the API response
            // };
      
            // Add the new record to the records list
            // this.records.push(newRecord);
      
            // Apply search and update pagination
            this.applySearch();
          },
          (error) => {
            console.error('Error fetching consent:', error);
          }
        );
      }

selectedRecord: { id: number; name: string; status: string; date: string; details?: string } | null = null;

onRecordClick(record: { id: number; name: string; status: string; date: string }): void {
  this.selectedRecord = {
    ...record,
    details: `This record belongs to institution ${record.name}. More details can be displayed here.`
  };
  console.log('Selected Record:', this.selectedRecord);
}


}
