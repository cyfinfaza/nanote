<script>
  export let prompt;
  export let submit = "Go";
  export let onSubmit = function () {};
  export let password = false;
  let inputElem;
</script>

<div>
  <input
    type={password ? "password" : "text"}
    placeholder={prompt}
    on:keydown={(e) => {
      if (e.key === "Enter") onSubmit(inputElem.value);
    }}
    bind:this={inputElem}
  />
  <button style="min-width: 64px;" on:click={(_) => onSubmit(inputElem.value)}>{submit}</button>
</div>

<style>
  div {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: calc(0.5 * var(--pad));
    width: 100%;
    max-width: 400px;
  }
</style>
