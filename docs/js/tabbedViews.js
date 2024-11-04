// tabbedViews.js

export function addTabbedViews() {
    // Event handler for tab clicks
    const onTabClick = (event) => {
        const { tabset, tabcontent } = event.target.dataset;

        // Find all tab buttons and content sections for the clicked tabset
        const tabSetList = document.querySelectorAll(`button[data-tabset="${tabset}"]`);
        const tabContentList = document.querySelectorAll(`.tabcontent[data-tabset="${tabset}"]`);

        // Clear previous active tabs and their content, including nested content
        tabSetList.forEach(tab => tab.classList.remove('active'));
        tabContentList.forEach(content => {
            content.classList.remove('active');
            
            // Make sure any nested content inside this content is also hidden
            const nestedContents = content.querySelectorAll('.tabcontent');
            nestedContents.forEach(nestedContent => nestedContent.classList.remove('active'));
        });

        // Set the clicked tab to active
        event.target.classList.add('active');

        // Show the corresponding content for the clicked tab
        const targetContent = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);
        if (targetContent) {
            targetContent.classList.add('active');

            // Handle any nested tabs inside the target content
            const nestedTabs = targetContent.querySelectorAll('button[data-tabset]');
            nestedTabs.forEach(nestedTab => {
                if (nestedTab.classList.contains('active')) {
                    const { tabset: nestedTabset, tabcontent: nestedTabcontent } = nestedTab.dataset;
                    const activeNestedContent = document.querySelector(`.tabcontent[data-tabset="${nestedTabset}"][data-tabcontent="${nestedTabcontent}"]`);
                    
                    // Make sure the active nested tab content is shown
                    if (activeNestedContent) {
                        activeNestedContent.classList.add('active');
                    }
                }
            });
        }
    };

    // Initialize tabs and contents
    const initializeTabs = () => {
        const tabs = document.querySelectorAll('button[data-tabset]');
        const tabGroups = {};
        tabs.forEach(tab => {
            const { tabset, tabcontent } = tab.dataset;

            // Ensure the parent container has the 'tabs' class
            if (!tab.parentElement.classList.contains('tabs')) {
                tab.parentElement.classList.add('tabs');
            }

            if (!tabGroups[tabset]) {
                tabGroups[tabset] = [];
            }

            tabGroups[tabset].push(tab);

            // Add click event listener to each tab
            tab.addEventListener('click', onTabClick);
        });

        Object.keys(tabGroups).forEach(tabset => {
            const tabsInSet = tabGroups[tabset];
            const activeTabExists = tabsInSet.some(tab => tab.classList.contains('active'));

            if (!activeTabExists && tabsInSet.length > 0) {
                const firstTab = tabsInSet[0];
                firstTab.classList.add('active');

                const { tabcontent } = firstTab.dataset;
                const firstContent = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);

                if (firstContent) {
                    firstContent.classList.add('active');

                    const nestedTabs = firstContent.querySelectorAll('button[data-tabset]');
                    nestedTabs.forEach(nestedTab => {
                        if (nestedTab.classList.contains('active')) {
                            const { tabset: nestedTabset, tabcontent: nestedTabcontent } = nestedTab.dataset;
                            const activeNestedContent = document.querySelector(`.tabcontent[data-tabset="${nestedTabset}"][data-tabcontent="${nestedTabcontent}"]`);
                            
                            if (activeNestedContent) {
                                activeNestedContent.classList.add('active');
                            }
                        }
                    });
                }
            }
        });
    };

    // Wrap tab contents with the tabset-wrapper logic
    const wrapTabContents = () => {
        const tabContents = document.querySelectorAll('div[data-tabset]');
        if (tabContents.length > 0) {
            const tabGroups = {};

            // Group the divs by their data-tabset values
            tabContents.forEach(div => {
                const tabset = div.getAttribute('data-tabset');

                if (!tabGroups[tabset]) {
                    tabGroups[tabset] = [];
                }

                tabGroups[tabset].push(div);
            });

            // Wrap each group of div[data-tabset] elements in a new wrapper div
            Object.keys(tabGroups).forEach(tabset => {
                const group = tabGroups[tabset];

                // Create the wrapper div
                const wrapper = document.createElement('div');
                wrapper.classList.add('tabset-wrapper');
                wrapper.setAttribute('data-tabset-group', tabset);

                // Insert the wrapper before the first element of the group
                const firstElement = group[0];
                firstElement.parentNode.insertBefore(wrapper, firstElement);

                // Move all grouped divs inside the wrapper while maintaining their order
                group.forEach(div => {
                    wrapper.appendChild(div);
                });
            });
        }
    };

    // Initialize the tab system
    const init = () => {
        wrapTabContents();
        initializeTabs();
    };

    // Run the initialization
    init();
}