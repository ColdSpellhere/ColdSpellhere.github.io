# 1.归一化，标准化
![Compare](https://i-blog.csdnimg.cn/blog_migrate/6aec0785b4affc9a049f8b7b796c9915.png)
## 归一化
```Python
Z = np.random.random((5,5))
print(Z)
print("\n")
Z_scale = (Z - np.min(Z)) / np.ptp(Z)) 
#最值归一化（MinMaxScaler） (np.ptp(Z))=(np.max(Z) - np.min(Z)
print(Z_scale)

```
###### 归一化运行结果例
```
[[0.46364375 0.78548223 0.72442223 0.68663041 0.68110256] [0.70568273 0.07519275 0.958697 0.2028082 0.41866144] [0.56644737 0.84278929 0.89113894 0.48064408 0.28365119] [0.48338433 0.58233878 0.59077714 0.4637845 0.5200544 ] [0.54851656 0.31392362 0.75729952 0.95367168 0.18563437]]

[[0.46364375 0.78548223 0.72442223 0.68663041 0.68110256] [0.70568273 0.07519275 0.958697 0.2028082 0.41866144] [0.56644737 0.84278929 0.89113894 0.48064408 0.28365119] [0.48338433 0.58233878 0.59077714 0.4637845 0.5200544 ] [0.54851656 0.31392362 0.75729952 0.95367168 0.18563437]]
```

## 标准化
```Python
Z = np.random.random((5,5))
print(Z)
print("\n")
Z = (Z - np.mean (Z)) / (np.std (Z))
print(Z)
```
###### 标准化运行结果例
```
[[0.73568395 0.04015236 0.48692444 0.37883354 0.93524418] [0.41309095 0.96252619 0.79763891 0.59653225 0.18358172] [0.86417374 0.71764583 0.80689974 0.74152617 0.79441388] [0.39287178 0.73110138 0.04942272 0.28836453 0.42616441] [0.92920924 0.38905728 0.38568728 0.82678806 0.97061093]]

[[ 0.50864319 -1.98418417 -0.38292598 -0.7703303 1.22387913] [-0.64754967 1.32165952 0.73069352 0.00991505 -1.47012468] [ 0.96915839 0.44399346 0.76388488 0.52958206 0.71913483] [-0.7200164 0.49221897 -1.95095864 -1.09457672 -0.60069361] [ 1.20224957 -0.73368781 -0.74576609 0.83516582 1.3506357 ]]
```

## 2.考虑一个可以描述10个三角形的triplets，找到可以分割全部三角形的line segment
![Triplets](https://i-blog.csdnimg.cn/blog_migrate/acff52c2510d4e635c72c3fa1ff4aaa7.png)

## 3.截取中心区域
```Python
import numpy as np

def extract_centered_subarray(

    array: np.ndarray,

    shape: tuple,

    center: tuple,

    fill: float = 0,

    padding_mode: str = 'constant'

) -> np.ndarray:

    # 参数校验

    if len(shape) != array.ndim:

        raise ValueError(f"shape维度 {len(shape)} 必须与输入数组维度 {array.ndim} 相同")

    if len(center) != array.ndim:

        raise ValueError(f"center维度 {len(center)} 必须与输入数组维度 {array.ndim} 相同")

    # 计算理论范围

    shape_arr = np.array(shape)

    center_arr = np.array(center)

    half_shape = shape_arr // 2

    start = center_arr - half_shape

    stop = center_arr + half_shape + (shape_arr % 2)  # 处理奇数形状

    # 处理边界

    array_shape = np.array(array.shape)

    start_corrected = np.maximum(start, 0)

    stop_corrected = np.minimum(stop, array_shape)

    # 计算填充区域

    pad_before = np.maximum(-start, 0)

    pad_after = np.maximum(stop - array_shape, 0)

    padding = list(zip(pad_before, pad_after))

    # 提取有效区域

    slices = tuple(slice(s, e) for s, e in zip(start_corrected, stop_corrected))

    valid_region = array[slices]

    # 根据填充模式处理

    if padding_mode == 'edge':

        # 边缘值填充

        pad_width = [(int(p[0]), int(p[1])) for p in padding]

        return np.pad(valid_region, pad_width, mode='edge')

    else:

        # 固定值填充

        result = np.full(shape, fill, dtype=array.dtype)

        insert_slices = tuple(slice(p[0], p[0] + stop_corrected[i] - start_corrected[i]) for i, p in enumerate(padding))

        result[insert_slices] = valid_region

        return result

# ------------------------- 示例用法 -------------------------
if __name__ == "__main__":
    # 示例1：2D数组中心提取
    Z = np.arange(25).reshape(5,5)
    print("原始数组:\n", Z)
    print("\n中心(1,1)的3x3子数组:\n", extract_centered_subarray(Z, (3,3), (1,1)))

    # 示例2：边界填充
    print("\n中心(0,0)的3x3子数组（自动填充）:\n", 
          extract_centered_subarray(Z, (3,3), (0,0), fill=-1))

    # 示例3：边缘值填充模式
    print("\n边缘填充模式:\n", 
          extract_centered_subarray(Z, (3,3), (0,0), padding_mode='edge'))
```
###### 从数组中提取以指定位置为中心的固定形状子数组，自动处理边界填充。
#参数:
`array (np.ndarray)`: 输入数组（支持任意维度）。
`shape (tuple)`: 目标子数组的形状（必须与输入数组维度相同）。
`center (tuple)`: 中心位置的坐标（如 (y,x) 或 (z,y,x)）。
`fill (float, optional)`: 填充值，默认为0。
`padding_mode (str, optional)`: 填充模式，可选 'constant'（固定值）或 'edge'（边缘值填充）。
#返回:
`np.ndarray`: 提取的子数组，形状为 `shape`。
###### 输出示例
```
>>>[[ 0  1  2  3  4]
	[ 5  6  7  8  9]
	[10 11 12 13 14]
	[15 16 17 18 19]
	[20 21 22 23 24]]
>>> [ 0  1  2]
	[ 5  6  7]
	[10 11 12]]
```