document.addEventListener('DOMContentLoaded', () => {
    const contentAreaElement = document.getElementById('content-area');
    const categoryListElement = document.getElementById('category-list'); 
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const searchResultsMessage = document.getElementById('search-results-message');

    if (!contentAreaElement) {
        console.error("Element with ID 'content-area' not found.");
        return;
    }
    // Category list and search elements are optional for core functionality
    if (!categoryListElement) {
        console.warn("Element with ID 'category-list' not found.");
    }
    if (!searchInput || !searchButton || !searchResultsMessage) {
        console.warn("Search elements not found.");
    }

    const blogPostsListId = 'blog-posts-list';
    let allPostsData = [];
    let uniqueCategories = [];
    let currentFilter = null;

    const MOCK_DATABASE = [
        {
            id: 'project-documentation',
            path: 'posts/project-documentation.md',
            title: "Understanding Our Simple Blog Project",
            author: "Jules the AI Assistant",
            date: "2099-01-01",
            category: "Project Info",
            summary: "A brief guide to the structure and functionality of this blog project, including how to add new posts and understand its technical workings.",
            content: `## Introduction

Welcome to our simple Markdown-powered blog! This project is designed to be a lightweight and easy-to-understand blogging system that renders posts written in Markdown. The goal is to provide a clean, readable, and modern interface, inspired by the aesthetics of platforms like Halo.

This document serves as a quick guide to understanding its structure, how content is managed, and the basic technical details behind its operation.

## File Structure

The project is organized into a few key files and directories:

*   \`index.html\`: This is the main HTML file that provides the basic structure for the entire blog, including the header, navigation, content area, sidebar, and footer.
*   \`css/\`: This directory contains all the styling for the blog.
    *   \`style.css\`: The primary stylesheet. It defines the layout, colors, typography, and responsive design.
*   \`js/\`: This directory holds the JavaScript code.
    *   \`main.js\`: This script is responsible for all the dynamic functionality of the blog, such as fetching posts, rendering Markdown, and handling navigation.
*   \`posts/\`: This directory contains all the blog post content. Each post is a separate Markdown (\`.md\`) file.

## Adding New Posts

Creating a new blog post is straightforward:

1.  **Create a Markdown File:** Add a new file with the \`.md\` extension to the \`posts/\` directory (e.g., \`my-new-article.md\`).
2.  **Add Frontmatter:** At the very beginning of your Markdown file, include a "frontmatter" block. This block is written in YAML format, enclosed by triple hyphens (\`---\`):

    \`\`\`yaml
    ---
    title: "Your Post Title Here"
    date: "YYYY-MM-DD"  # e.g., 2023-10-28
    author: "Your Name"
    category: "Relevant Category" # e.g., Technology, Lifestyle, etc.
    summary: "A short sentence or two summarizing your post. This appears on the post list."
    ---
    \`\`\`
    *   \`title\`: The title of your post.
    *   \`date\`: The publication date.
    *   \`author\`: The author's name.
    *   \`category\`: The category your post belongs to. This is used for filtering.
    *   \`summary\`: A brief description shown on the homepage list.

3.  **Write Your Content:** Below the closing \`---\` of the frontmatter, write your blog post content using standard Markdown syntax.

4.  **Update Post List (Manual Step for now):**
    Currently, \`js/main.js\` has a hardcoded list of post file paths (\`postPaths\` array). To make your new post appear, you'll need to manually add its path to this array. For example, if you created \`posts/my-new-article.md\`, you would add \`'posts/my-new-article.md'\` to the \`postPaths\` array in \`js/main.js\`. *Future improvements could automate this discovery process.*

## How \`js/main.js\` Works

The \`js/main.js\` script is the engine of the blog. Here's a summary of its key functions:

*   **Fetching Posts:** It fetches the content of each Markdown file specified in the \`postPaths\` array.
*   **Frontmatter Parsing:** For each post, it parses the frontmatter (title, date, author, category, summary) from the Markdown content. This metadata is used to display post information and for categorization.
*   **Post Listing (\`displayPostList\`):**
    *   It dynamically generates HTML to display a list of blog post summaries on the main page (\`#blog-posts-list\`).
    *   Each summary includes the title (as a link), the summary text from the frontmatter, and metadata like author, date, and category.
*   **Single Post View (\`displaySinglePostView\`):**
    *   When a post title is clicked, this function displays the full content of that post.
    *   It uses the \`marked.min.js\` library (included in \`index.html\`) to convert the Markdown content of the post into HTML.
    *   The rendered HTML is then injected into the main content area.
    *   A "Back to List" button is provided to navigate back to the main post list.
*   **Category System:**
    *   It extracts all unique categories from the frontmatter of the posts.
    *   It dynamically generates a list of these categories in the sidebar (\`#category-list\`).
    *   Clicking on a category filters the post list to show only posts belonging to that category. An "All Categories" option is also available.

## Styling Approach

The blog's appearance is controlled by \`css/style.css\`. The design aims for a clean, modern, and readable layout, taking inspiration from the minimalist and content-focused aesthetic often found in Halo themes.

Key styling aspects include:

*   **Responsive Design:** The layout adapts to different screen sizes, ensuring a good experience on desktops, tablets, and mobile devices.
*   **Typography:** Emphasis on clear and legible fonts.
*   **Whitespace:** Generous use of whitespace to improve readability and visual separation of elements.
*   **Markdown Styling:** Detailed styling for all standard Markdown elements (headings, lists, code blocks, etc.) to ensure content is presented attractively.
*   **Color Palette:** A restrained color scheme with a primary accent color for interactive elements.

This project serves as a good example of how to build a simple but functional static blog using vanilla JavaScript, Markdown, and CSS.`
        },
        {
            id: 'post1',
            path: 'posts/post1.md',
            title: "My First Blog Post",
            author: "John Doe",
            date: "2023-10-26",
            category: "Technology",
            summary: "This is a short summary of my first blog post, exploring new tech.",
            content: `## Welcome to My First Post

This is the main content of my *first blog post*. I'm excited to share my thoughts on various topics.

- Item 1
- Item 2

Stay tuned for more updates!`
        },
        {
            id: 'post2',
            path: 'posts/post2.md',
            title: "Understanding JavaScript Closures",
            author: "Jane Smith",
            date: "2023-10-25",
            category: "Programming",
            summary: "A deep dive into JavaScript closures and how they work.",
            content: `## JavaScript Closures Explained

Closures are a fundamental concept in JavaScript. A closure gives you access to an outer function's scope from an inner function.

\`\`\`javascript
function init() {
  var name = "Mozilla"; // name is a local variable created by init
  function displayName() { // displayName() is the inner function, a closure
    alert(name); // use variable declared in the parent function
  }
  displayName();
}
init();
\`\`\`

Understanding closures is key to becoming a proficient JavaScript developer.`
        },
        {
            id: 'about',
            path: 'posts/about.md', 
            title: "About This Blog",
            content: `## Welcome!

This blog is a space for thoughts, ideas, and explorations. 

Built with simplicity in mind, it aims to be a clean and enjoyable reading experience.

More content about the author or the blog's purpose will go here. For now, this is placeholder text.`
        }
    ];
    
    const mockComments = [
        { author: "Commenter1", date: "2023-01-15", text: "Great post, very informative!" },
        { author: "AnotherReader", date: "2023-01-16", text: "I learned a lot from this. Thanks for sharing." },
        { author: "TechEnthusiast", date: "2023-01-17", text: "Looking forward to more content like this." }
    ];

    function initializeBlogData() {
        // Filter MOCK_DATABASE to get only blog posts (items with a category and date)
        allPostsData = MOCK_DATABASE.filter(item => item.category && item.date);

        // Sort posts by date (newest first)
        allPostsData.sort((a, b) => {
            const dateA = a.date ? new Date(a.date) : null;
            const dateB = b.date ? new Date(b.date) : null;

            if (dateA && dateB) {
                return dateB - dateA; // Sort descending
            }
            if (dateA) return -1; 
            if (dateB) return 1;  
            return 0; 
        });
        
        // Extract unique categories
        const categories = new Set();
        allPostsData.forEach(post => {
            if (post.category) {
                categories.add(post.category.trim());
            }
        });
        uniqueCategories = ['All Categories', ...Array.from(categories).sort()];

        if (allPostsData.length === 0) {
             console.warn("Could not load any blog posts from MOCK_DATABASE.");
        }
        
        displayCategoryList();
        displayPostList(allPostsData); // Display all posts initially
    }

    function displayCategoryList() {
        if (!categoryListElement) return; 

        let ul = categoryListElement.querySelector('ul');
        if (!ul) {
            ul = document.createElement('ul');
            const h2 = categoryListElement.querySelector('h2');
            if (h2 && h2.nextSibling) {
                categoryListElement.insertBefore(ul, h2.nextSibling);
            } else if (h2) {
                 categoryListElement.appendChild(ul);
            } else { 
                categoryListElement.innerHTML = ''; 
                const newH2 = document.createElement('h2');
                newH2.textContent = 'Categories';
                categoryListElement.appendChild(newH2);
                categoryListElement.appendChild(ul);
            }
        }
        ul.innerHTML = ''; 

        uniqueCategories.forEach(category => {
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = '#'; 
            link.textContent = category;
            link.dataset.category = category;
            link.addEventListener('click', handleCategoryClick);
            
            if (category === (currentFilter === null && category === 'All Categories' ? 'All Categories' : currentFilter) ) {
                li.classList.add('active-category');
            }

            li.appendChild(link);
            ul.appendChild(li);
        });
    }

    function handleCategoryClick(event) {
        event.preventDefault();
        const selectedCategory = event.currentTarget.dataset.category;
        currentFilter = selectedCategory; 
        if(searchResultsMessage) searchResultsMessage.textContent = ''; 

        if (selectedCategory === 'All Categories') {
            displayPostList(allPostsData);
        } else {
            const filteredPosts = allPostsData.filter(post => post.category === selectedCategory);
            displayPostList(filteredPosts);
        }
        displayCategoryList(); 
    }

    function displayPostList(postsToDisplay) { 
        contentAreaElement.innerHTML = ''; 
        const postListSection = document.createElement('section');
        postListSection.id = blogPostsListId;

        if (!postsToDisplay || postsToDisplay.length === 0) {
            if (searchResultsMessage && searchResultsMessage.textContent) {
                // Search message already shown
            } else {
                const currentCategoryInfo = currentFilter && currentFilter !== 'All Categories' ? ` for category: ${currentFilter}` : '';
                postListSection.innerHTML = `<p>No blog posts found${currentCategoryInfo}.</p>`;
            }
            contentAreaElement.appendChild(postListSection); 
            return;
        }

        postsToDisplay.forEach(postData => {
            if (!postData) { // Simplified check
                console.warn("Skipping a post due to missing data:", postData);
                return;
            }
            const article = document.createElement('article');
            article.className = 'blog-post-summary';
            const titleElement = document.createElement('h2');
            const titleLink = document.createElement('a');
            titleLink.href = `#post/${postData.path}`; // path is still used for URL hash
            titleLink.textContent = postData.title || "Untitled Post";
            titleLink.dataset.postPath = postData.path;
            titleLink.addEventListener('click', handlePostTitleClick);
            titleElement.appendChild(titleLink);
            
            const summary = document.createElement('p');
            summary.textContent = postData.summary || "No summary available.";
            
            const meta = document.createElement('small');
            const dateString = postData.date ? new Date(postData.date).toLocaleDateString() : 'No date';
            const authorString = postData.author || 'Unknown author';
            meta.textContent = `By ${authorString} on ${dateString}`;
            if(postData.category) {
                const categorySpan = document.createElement('span');
                categorySpan.textContent = ` | Category: ${postData.category}`;
                categorySpan.style.marginLeft = '10px';
                meta.appendChild(categorySpan);
            }
            article.appendChild(titleElement);
            article.appendChild(summary);

            if (postData.summary && postData.summary.trim() !== "") {
                const readMoreP = document.createElement('p');
                readMoreP.className = 'read-more-link'; 
                const readMoreLink = document.createElement('a');
                readMoreLink.href = `#post/${postData.path}`;
                readMoreLink.textContent = "Read More →";
                readMoreLink.dataset.postPath = postData.path;
                readMoreLink.addEventListener('click', handlePostTitleClick);
                readMoreP.appendChild(readMoreLink);
                article.appendChild(readMoreP);
            }
            
            article.appendChild(meta); 
            postListSection.appendChild(article);
        });
        contentAreaElement.appendChild(postListSection);
    }

    function handlePostTitleClick(event) {
        event.preventDefault();
        const postPath = event.currentTarget.dataset.postPath;
        if (postPath) {
            displaySinglePostView(postPath);
        } else {
            console.error("Post path not found on clicked title element.");
        }
    }

    function displaySinglePostView(postPath) {
        // Find post by path from MOCK_DATABASE (as allPostsData only contains posts, not about page)
        const postData = MOCK_DATABASE.find(p => p.path === postPath); 
        if (!postData) {
            console.error(`Post with path ${postPath} not found in MOCK_DATABASE.`);
            contentAreaElement.innerHTML = `<p>Error: Post not found.</p><button id="back-to-list-error">Back to List</button>`;
            const backButtonError = document.getElementById('back-to-list-error');
            if (backButtonError) { 
                 backButtonError.addEventListener('click', () => displayPostList(allPostsData)); 
            }
            return;
        }
        contentAreaElement.innerHTML = ''; 
        
        const postArticle = document.createElement('article');
        postArticle.className = 'blog-post-full';
        const titleElement = document.createElement('h1');
        titleElement.textContent = postData.title || "Untitled Post";
        postArticle.appendChild(titleElement);
        
        if (postData.author && postData.date) { // Display meta only if it's a blog post
            const meta = document.createElement('small');
            const dateString = new Date(postData.date).toLocaleDateString();
            meta.textContent = `By ${postData.author} on ${dateString}`;
            if(postData.category) {
                const categorySpan = document.createElement('span');
                categorySpan.textContent = ` | Category: ${postData.category}`;
                categorySpan.style.marginLeft = '10px';
                meta.appendChild(categorySpan);
            }
            postArticle.appendChild(meta);
        }

        const spacer = document.createElement('hr');
        postArticle.appendChild(spacer);
        
        const contentDisplay = document.createElement('div');
        contentDisplay.className = 'rendered-markdown';
        if (typeof marked !== 'undefined') {
            contentDisplay.innerHTML = marked.parse(postData.content);
        } else {
            console.error("Marked.js library not loaded. Displaying raw Markdown.");
            const pre = document.createElement('pre');
            pre.textContent = postData.content;
            contentDisplay.appendChild(pre);
        }
        postArticle.appendChild(contentDisplay);
        
        const backButton = document.createElement('button');
        backButton.id = 'back-to-list';
        backButton.textContent = '← Back to List';
        backButton.style.marginTop = '20px';
        backButton.addEventListener('click', () => {
            if (currentFilter && currentFilter !== 'All Categories') {
                const filteredPosts = allPostsData.filter(post => post.category === currentFilter);
                displayPostList(filteredPosts);
            } else {
                displayPostList(allPostsData);
            }
        });
        contentAreaElement.appendChild(postArticle);
        
        // --- Mock Comments Section (only for actual posts) ---
        if (postData.category && postData.date) { // Assuming 'about' page won't have category/date
            const commentsSection = document.createElement('section');
            commentsSection.id = 'comments-section';

            const commentsHeading = document.createElement('h2');
            commentsHeading.textContent = 'Comments';
            commentsSection.appendChild(commentsHeading);

            mockComments.forEach(comment => {
                const commentItem = document.createElement('div');
                commentItem.className = 'comment-item';
                const authorP = document.createElement('p');
                authorP.className = 'comment-author';
                authorP.textContent = comment.author;
                const dateSpan = document.createElement('span');
                dateSpan.className = 'comment-date';
                const commentDate = new Date(comment.date);
                dateSpan.textContent = commentDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
                const textP = document.createElement('p');
                textP.textContent = comment.text;
                commentItem.appendChild(authorP);
                commentItem.appendChild(dateSpan);
                commentItem.appendChild(textP);
                commentsSection.appendChild(commentItem);
            });

            const commentFormSection = document.createElement('div');
            commentFormSection.id = 'comment-form';
            const formHeading = document.createElement('h4');
            formHeading.textContent = 'Leave a Comment';
            commentFormSection.appendChild(formHeading);
            const nameInput = document.createElement('input');
            nameInput.type = 'text';
            nameInput.placeholder = 'Your Name';
            nameInput.disabled = true; 
            commentFormSection.appendChild(nameInput);
            const commentTextarea = document.createElement('textarea');
            commentTextarea.placeholder = 'Your Comment';
            commentTextarea.disabled = true; 
            commentFormSection.appendChild(commentTextarea);
            const submitButtonElement = document.createElement('button'); // Renamed to avoid conflict
            submitButtonElement.type = 'submit';
            submitButtonElement.textContent = 'Submit Comment';
            submitButtonElement.disabled = true; 
            commentFormSection.appendChild(submitButtonElement);
            commentsSection.appendChild(commentFormSection);
            contentAreaElement.appendChild(commentsSection);
        }
        // --- End Mock Comments Section ---

        contentAreaElement.appendChild(backButton); 
    }

    function displayAboutPage() {
        contentAreaElement.innerHTML = ''; 
        const aboutData = MOCK_DATABASE.find(item => item.id === 'about');

        if (!aboutData) {
            console.error("About page data not found in MOCK_DATABASE.");
            contentAreaElement.innerHTML = '<p>Error loading About page. Please try again later.</p>';
            return;
        }

        const aboutArticle = document.createElement('article');
        aboutArticle.className = 'blog-post-full'; 

        const titleElement = document.createElement('h1');
        titleElement.textContent = aboutData.title || "About";
        aboutArticle.appendChild(titleElement);

        const contentDisplay = document.createElement('div');
        contentDisplay.className = 'rendered-markdown';
        if (typeof marked !== 'undefined') {
            contentDisplay.innerHTML = marked.parse(aboutData.content);
        } else {
            console.error("Marked.js library not loaded. Displaying raw Markdown for About page.");
            const pre = document.createElement('pre');
            pre.textContent = aboutData.content;
            contentDisplay.appendChild(pre);
        }
        aboutArticle.appendChild(contentDisplay);
        contentAreaElement.appendChild(aboutArticle);
    }

    function displayArchivesPage() {
        contentAreaElement.innerHTML = ''; 
        const archivesContainer = document.createElement('div');
        archivesContainer.className = 'archives-container';
        const titleElement = document.createElement('h1');
        titleElement.textContent = 'Post Archives';
        archivesContainer.appendChild(titleElement);

        if (!allPostsData || allPostsData.length === 0) {
            const noPostsMessage = document.createElement('p');
            noPostsMessage.textContent = 'No posts to display in archives.';
            archivesContainer.appendChild(noPostsMessage);
            contentAreaElement.appendChild(archivesContainer);
            return;
        }

        allPostsData.forEach(postData => { // Already sorted
            if (!postData) {
                console.warn("Skipping a post in archives due to missing data:", postData);
                return;
            }
            const archiveItem = document.createElement('div');
            archiveItem.className = 'archive-item';
            const postTitle = document.createElement('h3');
            const titleLink = document.createElement('a');
            titleLink.href = `#post/${postData.path}`; 
            titleLink.textContent = postData.title || "Untitled Post";
            titleLink.dataset.postPath = postData.path; 
            titleLink.addEventListener('click', handlePostTitleClick); 
            postTitle.appendChild(titleLink);
            const postDate = document.createElement('small');
            const dateString = postData.date ? new Date(postData.date).toLocaleDateString() : 'No date available';
            postDate.textContent = `Published on: ${dateString}`;
            archiveItem.appendChild(postTitle);
            archiveItem.appendChild(postDate);
            archivesContainer.appendChild(archiveItem);
            const hr = document.createElement('hr');
            archivesContainer.appendChild(hr);
        });
        
        if (archivesContainer.lastChild && archivesContainer.lastChild.tagName === 'HR') {
            archivesContainer.removeChild(archivesContainer.lastChild);
        }
        contentAreaElement.appendChild(archivesContainer);
    }

    const navHomeLink = document.getElementById('nav-home');
    const navAboutLink = document.getElementById('nav-about');
    const navArchivesLink = document.getElementById('nav-archives'); 

    if (navHomeLink) {
        navHomeLink.addEventListener('click', (event) => {
            event.preventDefault();
            currentFilter = 'All Categories'; 
            if(searchResultsMessage) searchResultsMessage.textContent = ''; 
            if(searchInput) searchInput.value = ''; 
            displayPostList(allPostsData);
            displayCategoryList(); 
        });
    }

    if (navAboutLink) {
        navAboutLink.addEventListener('click', (event) => {
            event.preventDefault();
            displayAboutPage();
        });
    }

    if (navArchivesLink) {
        navArchivesLink.addEventListener('click', (event) => {
            event.preventDefault();
            displayArchivesPage();
        });
    }

    // Initial load
    initializeBlogData(); // Renamed from fetchAndDisplayPosts

    function performSearch() {
        if (!searchInput || !searchResultsMessage) return;

        const query = searchInput.value.trim().toLowerCase();
        searchResultsMessage.textContent = '';

        if (!query) {
            displayPostList(allPostsData); 
            return;
        }

        const filteredPosts = allPostsData.filter(post => {
            const title = (post.title || '').toLowerCase();
            const summary = (post.summary || '').toLowerCase();
            const content = (post.content || '').toLowerCase(); // Search content too
            return title.includes(query) || summary.includes(query) || content.includes(query);
        });

        if (filteredPosts.length > 0) {
            searchResultsMessage.textContent = `Found ${filteredPosts.length} post(s) matching '${query}'.`;
        } else {
            searchResultsMessage.textContent = `No posts found matching '${query}'.`;
        }
        currentFilter = null; 
        displayCategoryList(); 
        displayPostList(filteredPosts);
    }

    if (searchButton) {
        searchButton.addEventListener('click', performSearch);
    }

    if (searchInput) {
        searchInput.addEventListener('keyup', (event) => {
            if (event.key === 'Enter') {
                performSearch();
            }
        });
    }
});
