// main.js

import { addCodeBlockButtonsListener } from './codeBlockButtons.js';
import { addTabbedViewsListener } from './tabbedViews.js';
import { addInspectorFormListener } from './inspectorForm.js';
import { addInlineEditingListener } from './inlineEditing.js';

addCodeBlockButtonsListener(navigator.clipboard);
addTabbedViewsListener();
addInlineEditingListener();
addInspectorFormListener();
