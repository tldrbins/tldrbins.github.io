// main.js

import { addCodeBlockButtonsListener } from './codeBlockButtons.js';
import { addTabbedViewsListener } from './tabbedViews.js';
import { addParamsFormListener } from './paramsForm.js';

addCodeBlockButtonsListener(navigator.clipboard);
addTabbedViewsListener();
addParamsFormListener();
