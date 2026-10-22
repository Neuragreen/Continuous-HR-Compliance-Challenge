export function monthlyTrends(transactions,outcomes,{process='All',team='All',rule='All'}={},employees=[]){
 const employeeMap=new Map(employees.map(e=>[e.employee_id,e]));
 const scope=transactions.filter(t=>(process==='All'||t.type===process)&&(team==='All'||(t.department||employeeMap.get(t.employee_id)?.department||'Unspecified')===team));
 const relevant=outcomes.filter(o=>rule==='All'||o.rule_id===rule),applicable=new Set(relevant.map(o=>o.transaction_id)),bad=new Set(relevant.filter(o=>o.status==='exception').map(o=>o.transaction_id)),unknown=new Set(relevant.filter(o=>o.status==='unknown').map(o=>o.transaction_id));
 const months=[...new Set(scope.map(t=>t.effective_date.slice(0,7)))].sort();
 return months.map(m=>{const ts=scope.filter(t=>t.effective_date.startsWith(m)&&(rule==='All'||applicable.has(t.transaction_id))),total=ts.length,n=ts.filter(t=>bad.has(t.transaction_id)).length;return {m,total,bad:n,unknown:ts.filter(t=>unknown.has(t.transaction_id)).length,rate:total?n/total*100:0}});
}
