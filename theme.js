(function(){var t=localStorage.getItem('theme');if(t)document.documentElement.dataset.theme=t;
window.toggleTheme=function(){var d=document.documentElement,dark=d.dataset.theme?d.dataset.theme==='dark':matchMedia('(prefers-color-scheme: dark)').matches;d.dataset.theme=dark?'light':'dark';localStorage.setItem('theme',d.dataset.theme)}})();
