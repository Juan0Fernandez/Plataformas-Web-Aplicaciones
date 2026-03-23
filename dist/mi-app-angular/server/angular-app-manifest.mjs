
export default {
  bootstrap: () => import('./main.server.mjs').then(m => m.default),
  inlineCriticalCss: true,
  baseHref: '/Programaci-n-y-Plataformas-Web-Clases/',
  locale: undefined,
  routes: [
  {
    "renderMode": 2,
    "route": "/Programaci-n-y-Plataformas-Web-Clases"
  },
  {
    "renderMode": 2,
    "route": "/Programaci-n-y-Plataformas-Web-Clases/perfil"
  },
  {
    "renderMode": 2,
    "route": "/Programaci-n-y-Plataformas-Web-Clases/proyectos"
  },
  {
    "renderMode": 2,
    "route": "/Programaci-n-y-Plataformas-Web-Clases/proyectos-dos"
  },
  {
    "renderMode": 2,
    "preload": [
      "/Programaci-n-y-Plataformas-Web-Clases/chunk-BEXPFTUT.js"
    ],
    "route": "/Programaci-n-y-Plataformas-Web-Clases/formularios"
  },
  {
    "renderMode": 2,
    "preload": [
      "/Programaci-n-y-Plataformas-Web-Clases/chunk-BEXPFTUT.js"
    ],
    "route": "/Programaci-n-y-Plataformas-Web-Clases/formularios/formulario"
  },
  {
    "renderMode": 2,
    "preload": [
      "/Programaci-n-y-Plataformas-Web-Clases/chunk-BEXPFTUT.js"
    ],
    "route": "/Programaci-n-y-Plataformas-Web-Clases/formularios/formulario-dinamico"
  },
  {
    "renderMode": 2,
    "preload": [
      "/Programaci-n-y-Plataformas-Web-Clases/chunk-BEXPFTUT.js"
    ],
    "route": "/Programaci-n-y-Plataformas-Web-Clases/formularios/formulario-mas"
  }
],
  entryPointToBrowserMapping: undefined,
  assets: {
    'index.csr.html': {size: 859, hash: '0fe4dbdfac08c03d82c5d00f9cf66ea348fa204553fcbf59e6b4f1e8a0ab36b6', text: () => import('./assets-chunks/index_csr_html.mjs').then(m => m.default)},
    'index.server.html': {size: 1373, hash: 'd6a53b1637ae40fe5f593ac5afcfe6dc9d79989a732ed68ec35530916afbb42d', text: () => import('./assets-chunks/index_server_html.mjs').then(m => m.default)},
    'index.html': {size: 3721, hash: 'd3ff0109523c14f562d7c7702c487f2a70f56ff53c9cac71a5fbff74ce423389', text: () => import('./assets-chunks/index_html.mjs').then(m => m.default)},
    'formularios/formulario/index.html': {size: 4814, hash: '3295a1c59ce9992649c64cc54d08dca4cd3c48796e695b5879dde24914113561', text: () => import('./assets-chunks/formularios_formulario_index_html.mjs').then(m => m.default)},
    'perfil/index.html': {size: 3885, hash: 'e913cd898932b93bca7b37418ca55b6fca25eb0f91181cc24aab1bb740d88f7a', text: () => import('./assets-chunks/perfil_index_html.mjs').then(m => m.default)},
    'proyectos/index.html': {size: 4076, hash: 'ae0ada4b4081fead8842c91c7b8c523cd7e7cca5572cb0e044e922199cc6845a', text: () => import('./assets-chunks/proyectos_index_html.mjs').then(m => m.default)},
    'formularios/index.html': {size: 3507, hash: '070354a3a612f119b77493cdb07f4b948d8373188f61a239c013f586d0695ff0', text: () => import('./assets-chunks/formularios_index_html.mjs').then(m => m.default)},
    'proyectos-dos/index.html': {size: 4047, hash: 'b6e1a7d6e829934b9577d4ba2a39c5f328a96e894e6ea8c233ac1e409e284d27', text: () => import('./assets-chunks/proyectos-dos_index_html.mjs').then(m => m.default)},
    'formularios/formulario-mas/index.html': {size: 5290, hash: 'bb8e1bc348cb785a64b29a85d9a29c1b477e241136361822503a0911f90c8b1e', text: () => import('./assets-chunks/formularios_formulario-mas_index_html.mjs').then(m => m.default)},
    'formularios/formulario-dinamico/index.html': {size: 5555, hash: 'de88031ee19e721250ff390b28af363a682c9a286a38c89aed772985c9ff77cc', text: () => import('./assets-chunks/formularios_formulario-dinamico_index_html.mjs').then(m => m.default)},
    'styles-5INURTSO.css': {size: 0, hash: 'menYUTfbRu8', text: () => import('./assets-chunks/styles-5INURTSO_css.mjs').then(m => m.default)}
  },
};
