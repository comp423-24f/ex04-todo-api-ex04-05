/**
 * Enables instructors to rank hiring choices.
 *
 * @author Ajay Gandecha <agandecha@unc.edu>
 * @copyright 2024
 * @license MIT
 */

import {
  CdkDragDrop,
  moveItemInArray,
  transferArrayItem
} from '@angular/cdk/drag-drop';
import { Component, WritableSignal, signal } from '@angular/core';
import {
  ApplicationReviewOverview,
  ApplicationReviewStatus,
  HiringStatus
} from '../hiring.models';
import { HiringService } from '../hiring.service';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { ApplicationDialog } from '../dialogs/application-dialog/application-dialog.dialog';

@Component({
  selector: 'app-hiring-preferences',
  templateUrl: './hiring-preferences.component.html',
  styleUrl: './hiring-preferences.component.css'
})
export class HiringPreferencesComponent {
  /** Route for the routing module */
  public static Route = {
    path: 'preferences',
    title: 'Hiring',
    component: HiringPreferencesComponent
  };

  /** Store the application columns */
  notPreferred: ApplicationReviewOverview[] = [];
  notProcessed: ApplicationReviewOverview[] = [];
  preferred: ApplicationReviewOverview[] = [];

  courseSiteId: number;

  /** Constructor */
  constructor(
    private route: ActivatedRoute,
    protected hiringService: HiringService,
    protected dialog: MatDialog
  ) {
    // Load route data
    this.courseSiteId = this.route.parent!.snapshot.params['courseSiteId'];
    // Load the initial hiring status.
    this.hiringService
      .getStatus(this.courseSiteId)
      .subscribe((hiringStatus) => {
        this.notPreferred = hiringStatus.not_preferred;
        this.notProcessed = hiringStatus.not_processed;
        this.preferred = hiringStatus.preferred;
      });
  }

  drop(event: CdkDragDrop<ApplicationReviewOverview[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }

    // Ensure that the data in the backend remains in sync.
    this.updateHiringStatus();
  }

  /** Updates the hiring status data from the API. */
  updateHiringStatus() {
    // Ensure that the indexes are updated for all of the columns.
    for (let i = 0; i < this.notPreferred.length; i++) {
      this.notPreferred[i].preference = i;
      this.notPreferred[i].status = ApplicationReviewStatus.NOT_PREFERRED;
    }
    for (let i = 0; i < this.notProcessed.length; i++) {
      this.notProcessed[i].preference = i;
      this.notProcessed[i].status = ApplicationReviewStatus.NOT_PROCESSED;
    }
    for (let i = 0; i < this.preferred.length; i++) {
      this.preferred[i].preference = i;
      this.preferred[i].status = ApplicationReviewStatus.PREFERRED;
    }

    // Update in the database and sync
    this.hiringService
      .updateStatus(this.courseSiteId, {
        not_preferred: this.notPreferred,
        not_processed: this.notProcessed,
        preferred: this.preferred
      })
      .subscribe((hiringStatus) => {
        this.notPreferred = hiringStatus.not_preferred;
        this.notProcessed = hiringStatus.not_processed;
        this.preferred = hiringStatus.preferred;
      });
  }

  /** Opens the dialog for importing the roster */
  openDialog(application: ApplicationReviewOverview): void {
    let dialogRef = this.dialog.open(ApplicationDialog, {
      height: '600px',
      width: '800px',
      data: {
        courseSiteId: this.courseSiteId,
        review: application,
        status: {
          not_preferred: this.notPreferred,
          not_processed: this.notProcessed,
          preferred: this.preferred
        }
      }
    });
    dialogRef.afterClosed().subscribe((_) => {
      // Update the hiring data.
      this.hiringService
        .getStatus(this.courseSiteId)
        .subscribe((hiringStatus) => {
          this.notPreferred = hiringStatus.not_preferred;
          this.notProcessed = hiringStatus.not_processed;
          this.preferred = hiringStatus.preferred;
        });
    });
  }

  /**
   * Moves non-first choice applicants from not processed to the
   * not preferred column.
   */
  passOnNonFirstChoiceApplicants() {
    let notFirstChoice = this.notProcessed.filter(
      (a) => a.applicant_course_ranking > 1
    );
    this.notProcessed = this.notProcessed.filter(
      (a) => a.applicant_course_ranking === 1
    );
    this.notPreferred = this.notPreferred.concat(notFirstChoice);
    this.notPreferred.sort(
      (a, b) => a.applicant_course_ranking - b.applicant_course_ranking
    );
    this.updateHiringStatus();
  }

  /** Downloads a CSV of applications. */
  downloadCsv() {
    this.hiringService.downloadCourseHiringCsv(this.courseSiteId);
  }
}
