var c=async t=>{let{request:n,env:i}=t,e=new URL(n.url),a=r(e.searchParams.get("title")||"\u30AD\u30CE\u30B3\u4F1D\u8AAC\u30D3\u30EB\u30C9\u30B7\u30DF\u30E5\u30EC\u30FC\u30BF\u30FC"),s=`ogp-${e.searchParams.get("title")||"default"}`;return new Response(s,{status:200})};function r(t){return t.length>25?t.slice(0,25)+"\u2026":t}export{c as onRequestGet};
//# sourceMappingURL=ogp.js.map
