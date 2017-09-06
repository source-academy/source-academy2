defmodule SourceAcademy.Application do
  @moduledoc false
  use Application

  def start(_type, _args) do
    import Supervisor.Spec, warn: false

    children = [
      worker(SourceAcademy.Repo, []),
      supervisor(SourceAcademy.Endpoint, []),
    ]

    Supervisor.start_link(children,
      strategy: :one_for_one, name: SourceAcademy.Supervisor)
  end
end
