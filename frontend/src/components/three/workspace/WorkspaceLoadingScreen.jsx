function WorkspaceLoadingScreen() {
  return (
    <div className="workspace-loader">
      <div className="workspace-loader__inner">
        <div className="workspace-loader__spinner" />
        <p className="workspace-loader__text">Entering workspace...</p>
      </div>
    </div>
  );
}

export default WorkspaceLoadingScreen;
