// tabbedViews.js

export function addTabbedViewsListener() {
    const onTabClick = (event) => {
        const { tabset, tabcontent } = event.target.dataset;
        const tabSetList = document.querySelectorAll(`button[data-tabset="${tabset}"]`);
        const tabContentList = document.querySelectorAll(`.tabcontent[data-tabset="${tabset}"]`);

        tabSetList.forEach(tab => tab.classList.remove('active'));
        tabContentList.forEach(content => {
            content.classList.remove('active');
            
            // Make sure any nested content inside this content is also hidden
            const nestedContents = content.querySelectorAll('.tabcontent');
            nestedContents.forEach(nestedContent => nestedContent.classList.remove('active'));
        });

        event.target.classList.add('active');

        const targetContent = document.querySelector(`.tabcontent[data-tabset="${tabset}"][data-tabcontent="${tabcontent}"]`);
        if (targetContent) {
            targetContent.classList.add('active');

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

    const initializeTabs = () => {
        const tabs = document.querySelectorAll('button[data-tabset]');
        tabs.forEach(tab => {
            tab.addEventListener('click', onTabClick);
        });
    };

    initializeTabs();
}