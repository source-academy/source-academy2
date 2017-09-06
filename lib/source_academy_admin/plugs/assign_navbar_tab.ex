defmodule SourceAcademy.Plug.AssignNavbarTab do
  @moduledoc false
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, opts) do
    tab = opts[:tab] || "unknown"
    assign(conn, :navbar_tab, tab)
  end
end
