fetch('https://pelixstream.store').then(r=>r.text()).then(h=>{console.log(h.includes('manifest.webmanifest'))})
