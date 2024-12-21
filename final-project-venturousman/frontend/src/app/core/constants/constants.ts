import {Budget} from '../models/budget.model';

export const budgetData: Budget[] = [
  {value: "< $100", display: "< $100"},
  {value: "$100 - $200", display: "$100 - $200"},
  {value: "$200 - $300", display: "$200 - $300"},
  {value: "$300 - $400", display: "$300 - $400"},
  {value: "$400 - $500", display: "$400 - $500"},
  {value: "> $500", display: "> $500"},
];

export const TRAVEL_APP_STATE = 'TRAVEL_APP_STATE';

export enum SubmitState {
  IDEAL, FETCHING, ERROR, SUCCESS
}
