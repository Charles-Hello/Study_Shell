def is_chinese(word: str) -> bool:
    """
    说明:
        判断字符串是否为中文编码,如果是中文编码则为true，用quote解码变为中文编码,不是中文则为false，用unquote编码变为中文
    参数:
        :param word: 文本
    """
    for ch in word:
        if  "\u4e00" <= ch <= "\u9fff":
            return True
    return False
  