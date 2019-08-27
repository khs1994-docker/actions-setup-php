workflow "New workflow" {
  on = "push"
  resolves = ["setup-php"]
}

action "setup-php" {
  uses = "./"
}
