import { Injectable } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class TitleService implements MatPaginatorIntl {
    changes = new Subject<void>();

    firstPageLabel = `First page`;
    itemsPerPageLabel = `Items per page:`;
    lastPageLabel = `Last page`;

    nextPageLabel = 'Next page';
    previousPageLabel = 'Previous page';

    getRangeLabel(page: number, pageSize: number, length: number): string {
        if (length === 0) {
            return `Page 1 of 1`;
        }
        const amountPages = Math.ceil(length / pageSize);
        return `Showing page ${page + 1} of ${amountPages}`;
    }
}
