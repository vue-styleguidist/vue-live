<template functional>
  <div class="vue-live-container" style="display:flex; ">
    <div style="width:50%;">
      <slot name="editor"></slot>
    </div>
    <div style="background-color:white;width:50%;">
      <slot name="preview"></slot>
    </div>
  </div>
</template>
