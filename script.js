
(function(){
  // smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',(e)=>{
      const href=a.getAttribute('href');
      if(href.length>1){
        e.preventDefault();document.querySelector(href).scrollIntoView({behavior:'smooth'});
      }
    });
  });
  // Lightbox handler (delegated)
  document.addEventListener('click', function(e){
    if(e.target.closest('.gallery-grid a')){
      e.preventDefault();
      const a = e.target.closest('.gallery-grid a');
      const src = a.dataset.src;
      const lb = document.getElementById('lightbox');
      lb.querySelector('img').src = src;
      lb.classList.add('show');
    }
  }, false);

  const lb = document.getElementById('lightbox');
  if(lb){ lb.addEventListener('click', ()=> lb.classList.remove('show')); }

})();
