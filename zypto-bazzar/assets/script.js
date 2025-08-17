// ZYPTO BAZZAR Front Store Logic
const WA_NUMBER = '917319920817';
function waLink(text=''){
  const t = encodeURIComponent(text);
  return `https://wa.me/${WA_NUMBER}?text=${t}`;
}

const seedProducts = [
  {
    id:'lehenga-ruby-01',
    title:'Ruby Zari Lehenga',
    price: 4999,
    category:'Lehenga',
    description:'Hand-embroidered zari work with silk blend. Perfect for weddings & festivals.',
    images:[
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542060748-10c28b62716b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1583394838336-acd977736f90?q=80&w=1200&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1575928464081-8030a03454ae?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  {
    id:'anarkali-emerald-02',
    title:'Emerald Anarkali Suit',
    price: 3299,
    category:'Anarkali',
    description:'Flowy georgette with gota patti highlights and comfortable inner lining.',
    images:[
      'https://images.unsplash.com/photo-1612336307429-8a07f657668a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1544441893-675973e31985?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1592878904946-b3cd5f491f4a?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  {
    id:'saree-kesar-03',
    title:'Kesar Silk Saree',
    price: 2799,
    category:'Saree',
    description:'Pure silk-feel saree with delicate border; lightweight & elegant drape.',
    images:[
      'https://images.unsplash.com/photo-1612336307430-ef482b33a92a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1618242413526-9a8c7f9c9f3b?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1503342452485-86ff0a4c5b9e?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1548786811-58edcac2dfc0?q=80&w=1600&auto=format&fit=crop'
    ]
  },
  {
    id:'kurta-rose-04',
    title:'Rose Straight Kurta',
    price: 1499,
    category:'Kurta',
    description:'Cotton straight kurta with block print; breathable and skin-friendly.',
    images:[
      'https://images.unsplash.com/photo-1519741347686-35ea1e6a0e9a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1612336307429-8a07f657668a?q=80&w=1600&auto=format&fit=crop',
      'https://images.unsplash.com/photo-1542060748-10c28b62716b?q=80&w=1600&auto=format&fit=crop'
    ]
  }
];

function db(){
  const key='zypto_products_v1';
  return {
    all(){
      const raw = localStorage.getItem(key);
      if(!raw){
        localStorage.setItem(key, JSON.stringify(seedProducts));
        return seedProducts;
      }
      try{ return JSON.parse(raw); }catch(e){ return seedProducts; }
    },
    save(list){ localStorage.setItem(key, JSON.stringify(list)); },
    get(id){ return this.all().find(p=>p.id===id); },
    upsert(p){
      const list=this.all();
      const idx=list.findIndex(x=>x.id===p.id);
      if(idx>-1) list[idx]=p; else list.push(p);
      this.save(list);
    },
    remove(id){
      const list=this.all().filter(p=>p.id!==id);
      this.save(list);
    }
  }
}

// Home page listing
function renderHome(){
  const wrap = document.querySelector('#product-grid');
  if(!wrap) return;
  const list = db().all();
  wrap.innerHTML = list.map(p => `
    <a class="card product-card" href="product.html?id=${encodeURIComponent(p.id)}">
      <img loading="lazy" src="${p.images[0]}" alt="${p.title}">
      <div class="info">
        <div class="kicker">${p.category}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;gap:10px">
          <strong>${p.title}</strong>
          <span class="price">₹ ${p.price}</span>
        </div>
      </div>
    </a>
  `).join('');
}

// Product page
function renderProduct(){
  const el = document.querySelector('#product-page');
  if(!el) return;
  const params = new URLSearchParams(location.search);
  const id = params.get('id');
  const p = db().get(id) || db().all()[0];
  document.querySelector('#bc-title').textContent = p.title;
  const main = document.querySelector('#main-img');
  const thumbs = document.querySelector('.thumbs');
  main.src = p.images[0];
  thumbs.innerHTML = p.images.map((src,i)=>`<img data-src="${src}" class="${i===0?'active':''}" src="${src}" alt="thumb">`).join('');
  thumbs.querySelectorAll('img').forEach(img=>{
    img.addEventListener('click',()=>{
      main.src = img.dataset.src;
      thumbs.querySelectorAll('img').forEach(t=>t.classList.remove('active'));
      img.classList.add('active');
    });
  });
  document.querySelector('#pp-title').textContent = p.title;
  document.querySelector('#pp-price').textContent = '₹ ' + p.price;
  document.querySelector('#pp-desc').textContent = p.description;
  const qty = document.querySelector('#qty');
  const orderBtn = document.querySelector('#orderBtn');
  orderBtn.addEventListener('click',()=>{
    const q = Number(qty.value||1);
    const text = `Hi, I want to order: ${p.title} (Qty: ${q}). Product ID: ${p.id}`;
    location.href = waLink(text);
  });
}

// WhatsApp FAB
function attachFAB(){
  const btn = document.querySelector('#wa-fab');
  if(!btn) return;
  btn.addEventListener('click',()=>{
    const text = 'Hello! I want to order from ZYPTO BAZZAR.';
    location.href = waLink(text);
  })
}

document.addEventListener('DOMContentLoaded',()=>{
  renderHome();
  renderProduct();
  attachFAB();
});