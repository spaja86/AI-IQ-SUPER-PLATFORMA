import { readCheckout } from './revision-test-evidence.mjs';
import { validateVrhProfileRequest } from '../src/lib/petlje/vrh-individual-profiles';
import { dispatchVrhLoop } from '../src/lib/petlje/vrh-dispatcher';

/** Independent numerical service, not routing or planner logic. */
export function runIndirektLocalService(root: string, request: unknown, control: { execute: boolean; expectedRevision: string }) {
  const history=['queued'];
  const blocked=(reason:string)=>({state:'blocked',history:[...history,'blocked'],reason,result:null,serverAuthorized:false});
  if (!control || control.execute!==true || !/^[a-f0-9]{40}$/.test(control.expectedRevision)) return blocked('explicit-opt-in-and-revision-required');
  let call;
  try { call=validateVrhProfileRequest(request); } catch { return blocked('invalid-musema'); }
  if(call.name!=='INDIREKT PETLJA') return blocked('unsupported-service');
  const before=readCheckout(root);
  if(before.dirty || before.revision!==control.expectedRevision) return blocked('checkout-mismatch');
  history.push('running');
  const result=dispatchVrhLoop(call,'reference');
  const after=readCheckout(root);
  const stable=!after.dirty && after.revision===before.revision && after.sourceDigest===before.sourceDigest;
  const state=!stable?'blocked':result.completed?'passed':'failed';
  return {state,history:[...history,state],reason:stable?result.reason:'source-changed',result,provenance:{before,after,trust:'unsigned-local-observation'},serverAuthorized:false};
}
