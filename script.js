(function(){
        const manifestPath = 'images_webp/manifest.json';
        const grid = document.getElementById('grid');
        const loadingEl = document.getElementById('loading');
        const endEl = document.getElementById('end');

        let images = [];
        let index = 0;
        const BATCH = 8;
        let loading = false;

        function showLoading(show){ loadingEl.hidden = !show }
        function showEnd(){ endEl.hidden = false }

        function sortFiles(arr){
            return arr.slice().sort((a,b)=>{
                const na = parseInt(a.match(/(\d+)/)?.[0]||a,10);
                const nb = parseInt(b.match(/(\d+)/)?.[0]||b,10);
                if(!isFinite(na) || !isFinite(nb)) return a.localeCompare(b);
                return na-nb;
            });
        }

        function createCard(src){
            const card = document.createElement('div');
            card.className = 'card';
            const img = document.createElement('img');
            img.decoding = 'async';
            img.loading = 'lazy';
            img.alt = '';
            img.src = src;
            card.appendChild(img);
            return card;
        }

        function loadBatch(){
            if(loading) return;
            if(index >= images.length){ showLoading(false); showEnd(); return; }
            loading = true;
            showLoading(true);
            // small timeout so spinner is visible for very fast loads
            setTimeout(()=>{
                const end = Math.min(index + BATCH, images.length);
                for(; index < end; index++){
                    const file = images[index];
                    const src = 'images_webp/' + file;
                    const card = createCard(src);
                    grid.appendChild(card);
                }
                loading = false;
                showLoading(false);
                if(index >= images.length) showEnd();
            }, 120);
        }

        // IntersectionObserver on sentinel to trigger loading
        function setupObserver(){
            const sentinel = document.getElementById('sentinel');
            const io = new IntersectionObserver(entries=>{
                entries.forEach(e=>{
                    if(e.isIntersecting) loadBatch();
                });
            },{rootMargin:'400px'});
            io.observe(sentinel);
        }

        // Fetch manifest and start
        fetch(manifestPath, {cache:'no-store'}).then(r=>{
            if(!r.ok) throw new Error('Could not load manifest');
            return r.json();
        }).then(list=>{
            if(!Array.isArray(list) || list.length===0){ showEnd(); return; }
            images = sortFiles(list);
            loadBatch();
            setupObserver();
        }).catch(err=>{
            console.error(err);
            const msg = document.createElement('div');
            msg.textContent = 'Failed to load images.';
            grid.appendChild(msg);
        });
    })();