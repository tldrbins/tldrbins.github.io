// tabbedViews.js

export function addTabbedViewsListener() {
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
        tabs.forEach(tab => {
            tab.addEventListener('click', onTabClick);
        });
    };

    initializeTabs();
}