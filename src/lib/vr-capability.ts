export type VrCapabilityStatus = 'ready' | 'unavailable' | 'unsupported';

export interface VrCapabilityEnvironment {
  webglAvailable: boolean;
  webxrAvailable: boolean;
  immersiveVrSupported: boolean;
}

export interface VrCapabilityReport {
  status: VrCapabilityStatus;
  webglAvailable: boolean;
  webxrAvailable: boolean;
  immersiveVrSupported: boolean;
  message: string;
  disclaimer: string;
}

export function resolveVrCapabilityReport(environment: VrCapabilityEnvironment): VrCapabilityReport {
  const disclaimer = 'Ovo je provera mogućnosti pregledača; ne potvrđuje model naočara, fizički hardver niti kompatibilnost konkretne igre.';

  if (!environment.webglAvailable) {
    return { ...environment, status: 'unsupported', message: 'WebGL nije dostupan, pa 3D prikaz nije podržan u ovom pregledaču.', disclaimer };
  }
  if (!environment.webxrAvailable) {
    return { ...environment, status: 'unavailable', message: 'WebXR nije dostupan u ovom pregledaču ili uređaju.', disclaimer };
  }
  if (!environment.immersiveVrSupported) {
    return { ...environment, status: 'unavailable', message: 'Pregledač ne prijavljuje immersive VR podršku.', disclaimer };
  }
  return { ...environment, status: 'ready', message: 'Pregledač prijavljuje WebGL i immersive VR mogućnost. Proverite konkretnu igru i model naočara pre korišćenja.', disclaimer };
}
