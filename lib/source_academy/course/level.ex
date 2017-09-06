defmodule SourceAcademy.Course.Level do
  @moduledoc false
  @bounds Enum.with_index([
    0,
    270,
    559,
    867,
    1196,
    1547,
    1921,
    2320,
    2746,
    3200,
    3685,
    4203,
    4755,
    5344,
    5972,
    6642,
    7358,
    8121,
    8935,
    9804,
    10_731,
    11_719,
    12_774,
    13_900,
    15_101,
    16_382,
    17_750,
    19_208,
    20_765,
    22_425,
    24_196,
    26_087,
    28_103,
    30_255,
    32_550,
    35_000,
    37_613,
    40_401,
    43_375,
    46_549,
    49_935
  ])

  def from_xp(xp) do
    {_, idx} = @bounds
      |> Enum.reverse()
      |> Enum.find(fn {bxp, idx} -> bxp < xp end)
    idx
  end

  def xp_to_next(student) do
    level = student.level
    xp = student.experience_point
    next_level =
      Enum.find(@bounds, fn {bxp, idx} -> idx == level + 1 end)
    if next_level == nil do
      0
    else
      {next_xp, _} = next_level
      next_xp - xp
    end
  end
end
