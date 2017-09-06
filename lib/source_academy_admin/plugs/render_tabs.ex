defmodule SourceAcademy.Plug.RenderTabs do
  @moduledoc false
  import Plug.Conn

  def init(opts), do: opts

  def call(conn, opts) do
    tab = opts[:tab] || "unknown"
    assign(conn, :primary_tab, tab)
  end
end
