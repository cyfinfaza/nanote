<script>
  import Prompt from "../components/Prompt.svelte";
  let serverURL = "";
  let users = [];
  let username = "";
  $: (async (url) => {
    console.log(url);
    if (url) {
      try {
        let res = await fetch(url + "/users");
        users = await res.json();
      } catch (error) {}
    }
  })(serverURL);
</script>

<div class="container">
  <h1>Welcome.</h1>
  <div>
    <Prompt prompt="Enter your server URL" onSubmit={(url) => (serverURL = url)} />
  </div>
  <div class={"avatars" + (users.length > 0 ? "" : " disabled")}>
    {#if users.length > 0}
      {#each users as user}
        <div class="avatar">
          <img class="avatarImg" src={serverURL + "/userImg/" + user.user} alt="" />
          <p>{user.name}</p>
        </div>
      {/each}
    {:else}
      <div class="avatar">
        <div class="avatarImg" />
        <p>----</p>
      </div>
    {/if}
  </div>
  <div class={username ? "" : "disabled"}>
    <Prompt password prompt="Enter password" />
  </div>
</div>

<style lang="scss">
  .container {
    padding: calc(var(--pad) * 2);
    padding-top: var(--pad-top);
    padding-bottom: var(--pad-top);
    display: flex;
    flex-direction: column;
    // align-items: center;
    justify-content: center;
    box-sizing: border-box;
    width: 100%;
    gap: 16px;
    & > * {
      margin: 0;
    }
    > div {
      width: 100%;
    }
  }
  .avatars {
    display: flex;
    > .avatar {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: calc(0.5 * var(--pad));
      padding: var(--pad);
      transition: 120ms;
      border-radius: 12px;
      &:hover {
        background-color: var(--fg);
      }
      &:active {
        filter: contrast(0.8);
        transform: translateY(1px);
      }
      > .avatarImg {
        width: 100px;
        height: 100px;
        border-radius: 50%;
        background-color: var(--fg);
      }
      > p {
        margin: 0;
      }
    }
  }
  .disabled {
    pointer-events: none;
    opacity: 0.5;
  }
</style>
