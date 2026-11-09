
        document.addEventListener('click', (e) => {
            const li = e.target.closest('.work-row');
            if (!li) return;
            const url = li.getAttribute('data-proj-url');
            if (url) window.location.href = url;
        });
    