import React, { useEffect, useState } from "react";
import useDataSchema from "../hooks/useDataSchema";
import ComponentFields from "./tokens/ComponentFields";
import { addToDocument, showPreview } from "./utils";
import DraggableImage from "./tokens/DraggableImage";

const waveThreads = {
	beach: "M 907.493 59.998 C 868.981 59.998 839.779 35.389 820.855 12.303 C 795.647 43.43 766.301 59.837 735.716 59.847 L 735.706 59.847 C 705.095 59.847 675.754 43.44 650.544 12.306 C 625.441 43.461 596.11 59.888 565.371 59.898 L 565.361 59.898 C 527.279 59.898 498.546 35.098 480.199 12.306 C 454.947 43.461 426.715 59.448 396.232 59.837 C 395.858 59.837 395.496 59.847 395.122 59.847 C 364.422 59.847 335.085 43.461 309.886 12.326 C 284.206 43.891 255.58 59.888 224.713 59.898 L 224.703 59.898 C 193.91 59.898 165.285 43.89 139.541 12.306 C 106.454 52.646 52.415 77.009 2.048 43.03 C 1.01487 42.3442 0.302358 41.2704 0.072 40.052 C -0.147484 38.8425 0.141973 37.596 0.872 36.607 C 2.45853 34.5125 5.40338 34.0191 7.586 35.482 C 54.613 67.21 105.781 41.506 135.635 1.953 C 136.558 0.746556 137.99 0.039514 139.509 0.041 L 139.531 0.041 C 141.043 0.033662 142.473 0.728569 143.401 1.922 C 168.227 34.264 195.583 50.66 224.701 50.66 L 224.711 50.66 C 253.911 50.66 281.258 34.26 306.02 1.922 C 306.952 0.727446 308.386 0.0326873 309.901 0.041 L 309.922 0.041 C 311.439 0.0352651 312.872 0.737965 313.796 1.941 C 330.681 24.208 358.442 50.607 395.127 50.607 L 396.109 50.607 C 424.981 50.239 451.973 33.843 476.34 1.879 C 477.27 0.681511 478.705 -0.0139953 480.221 -0.002 L 480.231 -0.002 C 481.758 -0.00712362 483.2 0.699832 484.131 1.91 C 500.866 24.147 528.542 50.659 565.365 50.659 L 565.375 50.659 C 602.166 50.659 629.863 24.147 646.62 1.91 C 647.55 0.69792 648.994 -0.00945042 650.522 -0.002 L 650.522 -0.002 C 652.046 -0.0131346 653.488 0.686367 654.422 1.89 C 678.945 34.225 706.301 50.62 735.701 50.62 L 735.711 50.62 C 765.095 50.61 792.418 34.234 816.943 1.944 C 817.869 0.742923 819.301 0.0407291 820.817 0.044 L 820.841 0.044 C 822.354 0.0361167 823.786 0.731442 824.715 1.926 C 842.846 25.553 872.849 53.272 912.715 50.612 C 932.915 49.303 947.857 38.563 956.83 29.777 C 958.623 28.028 960.456 25.877 962.393 23.63 C 969.934 14.83 980.244 2.795 995.926 5.158 C 997.162 5.31772 998.282 5.96609 999.035 6.95805 C 999.789 7.95001 1000.11 9.20275 999.937 10.436 C 999.73 11.6613 999.034 12.7498 998.008 13.451 C 996.962 14.174 995.678 14.4679 994.422 14.272 C 984.2 12.728 976.907 21.247 969.822 29.492 C 967.693 31.968 965.675 34.31 963.706 36.243 C 953.556 46.164 936.585 58.316 913.371 59.819 C 911.386 59.942 909.417 60.003 907.487 60.003",
	chained:
		"M 724.955 59.997 C 722.248 59.686 720.197 57.4072 720.172 54.6827 C 720.146 51.9581 722.154 49.6414 724.855 49.28 C 734.849 49.042 744.077 43.524 747.291 35.869 C 749.362 30.932 748.558 25.869 744.902 20.82 C 733.921 5.664 711.58 10.946 693.346 17.248 C 679.939 21.877 666.626 27.656 653.746 33.248 C 623.518 46.362 592.257 59.94 556.894 59.999 L 556.888 59.999 C 554.191 59.7007 552.135 57.4459 552.087 54.733 C 552.039 52.0201 554.013 49.6934 556.697 49.299 C 566.209 48.883 574.949 43.365 577.95 35.899 C 579.974 30.855 579.079 25.562 575.362 20.577 C 564.162 5.563 542.085 10.928 524.099 17.266 C 511.099 21.847 498.172 27.46 485.673 32.885 C 455.054 46.185 423.389 59.944 387.535 60.004 L 387.535 60.004 C 384.828 59.693 382.777 57.4142 382.752 54.6897 C 382.726 51.9651 384.734 49.6484 387.435 49.287 C 397.449 49.049 406.691 43.519 409.911 35.853 C 411.979 30.916 411.18 25.872 407.536 20.828 C 396.564 5.672 374.218 10.954 355.972 17.256 C 342.565 21.885 329.258 27.664 316.385 33.242 C 286.136 46.368 254.859 59.942 219.479 60.005 L 219.473 60.005 C 216.776 59.707 214.72 57.4523 214.671 54.7394 C 214.623 52.0265 216.597 49.6996 219.281 49.305 C 228.819 48.878 237.572 43.371 240.576 35.894 C 242.598 30.862 241.704 25.58 237.988 20.594 C 226.788 5.58 204.709 10.921 186.724 17.259 C 173.724 21.852 160.8 27.466 148.304 32.889 C 117.689 46.189 86.033 59.948 50.184 60.008 L 50.172 60.008 C 47.4644 59.7011 45.4097 57.4251 45.3805 54.7003 C 45.3512 51.9755 47.3566 49.6559 50.057 49.291 C 62.179 48.982 70.765 41.391 72.981 34.052 C 74.77 28.129 72.673 22.327 66.924 17.247 C 51.675 3.791 25.373 14.259 7.954 21.178 L 6.444 21.783 C 5.19827 22.2311 3.82164 22.1355 2.64976 21.5197 C 1.47788 20.9038 0.618443 19.8241 0.281 18.544 C -0.654139 15.8495 0.610614 12.8854 3.203 11.696 L 4.703 11.104 C 24.13 3.376 53.485 -8.278 72.912 8.859 C 81.866 16.752 85.22 27.171 82.112 37.449 C 81.0995 40.7512 79.5055 43.8461 77.405 46.588 C 100.56 42.126 122.211 32.714 144.776 22.911 C 157.417 17.416 170.489 11.743 183.789 7.055 C 204.662 -0.315 230.529 -6.19 245.399 13.749 C 251.433 21.855 252.88 31.504 249.365 40.249 C 248.422 42.5687 247.178 44.7541 245.665 46.749 C 268.771 42.394 290.359 33.03 312.865 23.262 C 325.896 17.613 339.365 11.762 353.098 7.026 C 374.264 -0.284 400.428 -6.088 415.036 14.111 C 421.003 22.347 422.283 31.676 418.636 40.363 C 417.71 42.5587 416.51 44.6284 415.064 46.523 C 438.116 42.037 459.682 32.673 482.153 22.906 C 494.797 17.423 507.872 11.738 521.171 7.05 C 542.047 -0.303 567.903 -6.189 582.785 13.75 C 588.823 21.844 590.271 31.505 586.755 40.25 C 585.819 42.5728 584.574 44.7591 583.055 46.75 C 606.155 42.406 627.739 33.031 650.234 23.263 C 663.265 17.614 676.734 11.763 690.471 7.016 C 711.618 -0.271 737.771 -6.084 752.403 14.116 C 758.379 22.365 759.666 31.693 756.02 40.381 C 755.096 42.5744 753.901 44.6438 752.464 46.541 C 775.512 42.041 797.082 32.679 819.544 22.911 C 832.184 17.416 845.265 11.743 858.555 7.055 C 870.803 2.735 903.345 -8.745 920.146 13.749 C 926.19 21.831 927.646 31.48 924.146 40.215 C 923.084 42.8529 921.627 45.3143 919.826 47.515 C 945.415 43.8637 970.207 35.9359 993.167 24.063 C 994.355 23.4903 995.731 23.4504 996.95 23.9533 C 998.169 24.4562 999.116 25.4543 999.555 26.698 C 1000.09 28.0009 1000.14 29.4526 999.699 30.79 C 999.289 32.082 998.388 33.1613 997.19 33.795 C 963.613 50.909 928.017 59.964 894.256 59.995 L 894.24 59.995 C 891.557 59.6795 889.52 57.4299 889.472 54.7288 C 889.423 52.0278 891.378 49.7066 894.048 49.295 C 903.586 48.856 912.348 43.337 915.337 35.861 C 917.349 30.841 916.451 25.561 912.737 20.587 C 901.523 5.573 879.449 10.926 861.487 17.252 C 848.487 21.845 835.565 27.459 823.069 32.882 C 792.453 46.185 760.803 59.94 724.954 60.004 Z",
	longStrokes:
		"M 344.508 60.001 C 344.13 60.0006 343.754 59.9576 343.386 59.873 C 342.8 59.7295 342.245 59.4793 341.75 59.135 L 341.74 59.125 L 341.734 59.125 C 341.728 59.115 341.709 59.115 341.696 59.103 L 341.696 59.093 C 341.312 58.8232 340.972 58.4953 340.689 58.121 L 340.689 58.121 L 340.679 58.111 L 340.666 58.089 L 340.656 58.079 L 340.647 58.069 C 340.373 57.7026 340.154 57.2984 339.996 56.869 L 339.996 56.869 L 339.996 56.859 L 339.996 56.837 C 339.996 56.827 339.986 56.827 339.989 56.815 C 339.992 56.803 339.989 56.805 339.983 56.805 C 339.977 56.7949 339.973 56.7841 339.97 56.773 L 339.97 56.763 C 339.942 56.6932 339.918 56.6217 339.899 56.549 C 339.739 56.014 339.592 55.491 339.45 54.988 C 334.368 37.908 325.276 26.354 311.691 19.706 C 271.252 -0.094 199.318 29.367 151.714 48.862 C 141.773 52.934 132.374 56.772 124.445 59.7 C 123.183 60.1679 121.783 60.0864 120.584 59.4753 C 119.385 58.8641 118.496 57.7791 118.133 56.483 C 113.753 40.931 105.19 29.506 92.68 22.536 C 67.514 8.501 31.734 14.306 6.15 21.649 C 4.49088 22.135 2.69852 21.6953 1.45279 20.4965 C 0.20705 19.2977 -0.301242 17.5236 0.120708 15.847 C 0.542658 14.1704 1.83021 12.8483 3.495 12.382 C 30.827 4.536 69.303 -1.524 97.371 14.114 C 110.805 21.596 120.359 33.279 125.833 48.873 C 132.533 46.286 140.119 43.187 148.055 39.937 C 200.203 18.592 271.612 -10.641 315.903 11.035 C 326.599 16.2537 335.463 24.5896 341.328 34.945 C 343.397 34.197 346.393 34.518 348.828 37.724 C 350.861 40.6353 351.968 44.0923 352.005 47.643 C 367.094 42.363 381.755 35.586 396.005 29.013 C 420.148 17.865 445.113 6.343 472.831 1.533 C 509.503 -4.838 544.014 9.068 561.913 35.512 C 562.092 35.405 562.279 35.298 562.474 35.191 C 564.53 34.165 567.883 34.191 570.564 37.724 C 572.555 40.5712 573.659 43.9443 573.736 47.418 C 581.513 44.543 590.214 41.079 599.27 37.467 C 649.189 17.544 717.559 -9.733 759.631 11.055 C 774.405 18.355 784.943 31.055 791.013 48.85 C 800.138 45.269 810.305 40.77 820.968 36.056 C 876.69 11.401 953.015 -22.377 998.703 26.523 C 1000.52 28.4713 1000.42 31.5245 998.468 33.3428 C 996.52 35.161 993.467 35.0558 991.648 33.1078 C 950.658 -10.79 880.903 20.079 824.866 44.876 C 812.175 50.487 800.176 55.801 789.603 59.701 C 788.341 60.169 786.94 60.0875 785.741 59.4764 C 784.541 58.8653 783.652 57.7802 783.289 56.484 C 778.26 38.537 769.125 26.501 755.363 19.701 C 717.141 0.828 651.081 27.176 602.846 46.415 C 589.961 51.556 577.787 56.415 567.764 59.754 C 567.615 59.807 567.463 59.8498 567.309 59.882 L 567.309 59.882 C 567.294 59.882 567.276 59.872 567.258 59.892 C 567.258 59.892 567.252 59.902 567.23 59.892 L 567.208 59.902 C 567.198 59.9004 567.189 59.9043 567.183 59.912 C 567.173 59.902 567.167 59.912 567.154 59.912 L 567.132 59.912 C 566.561 60.0167 565.975 60.0201 565.403 59.922 L 565.368 59.922 C 565.368 59.912 565.362 59.912 565.359 59.912 L 565.34 59.912 C 565.253 59.89 565.164 59.88 565.074 59.858 L 565.074 59.858 C 565.064 59.858 565.055 59.858 565.055 59.848 L 565.036 59.848 C 565.03 59.838 565.026 59.838 565.021 59.838 L 564.992 59.838 C 563.596 59.4567 562.443 58.4731 561.847 57.155 L 561.847 57.155 C 561.847 57.145 561.847 57.155 561.838 57.133 C 561.838 57.133 561.831 57.133 561.828 57.111 L 561.828 57.111 C 561.828 57.101 561.822 57.101 561.822 57.101 L 561.822 57.091 C 561.763 56.952 561.71 56.813 561.662 56.674 C 550.698 23.358 514.032 4.174 474.502 11.024 C 448.026 15.631 423.644 26.886 400.067 37.767 C 382.726 45.773 364.795 54.046 345.919 59.786 C 345.789 59.8321 345.655 59.8679 345.519 59.893 C 345.525 59.903 345.497 59.903 345.478 59.903 C 345.459 59.903 345.469 59.913 345.459 59.903 C 345.456 59.9102 345.448 59.9142 345.44 59.913 L 345.413 59.913 C 345.4 59.913 345.387 59.923 345.372 59.923 L 345.372 59.923 C 345.089 59.9747 344.801 59.9998 344.513 59.998",
	sine: "M 554.48 59.993 C 546.603 60.1163 538.768 58.8325 531.342 56.202 C 519.458 51.159 508.749 45.879 498.405 40.763 C 472.467 27.952 447.973 15.854 415.089 12.802 C 373.589 6.643 344.18 20.718 313.07 35.626 C 301.378 41.236 289.291 47.026 276.349 51.834 C 251.587 61.04 220.797 61.04 196.035 51.834 C 190.535 49.399 185.262 46.983 179.898 44.534 C 125.329 19.56 63.483 -8.737 7.846 29.618 C 6.80456 30.3152 5.55306 30.6284 4.306 30.504 C 3.07943 30.4064 1.92996 29.867 1.071 28.986 C 0.2836 28.1853 -0.100059 27.0718 0.027 25.956 C 0.191833 24.8218 0.835229 23.8129 1.794 23.185 C 62.415 -18.598 130.075 12.367 184.44 37.242 C 189.773 39.686 195.02 42.083 200.182 44.389 C 222.282 52.589 250.123 52.58 272.512 44.261 C 285.012 39.621 296.879 33.929 308.357 28.419 C 339.563 13.465 371.849 -2.011 416.436 4.634 C 451.03 7.834 476.38 20.357 503.226 33.608 C 513.443 38.66 524.012 43.885 535.404 48.717 C 562.592 58.817 604.934 42.174 645.898 26.075 C 680.898 12.329 717.127 -1.925 745.438 0.212 C 772.797 3.112 794.876 15.047 816.229 26.597 C 828.597 33.278 840.251 39.583 852.835 44.26 C 904.55 61.337 957.235 38.247 992.302 15.86 C 993.367 15.1926 994.631 14.9168 995.877 15.08 C 997.096 15.2138 998.223 15.7915 999.043 16.703 C 999.796 17.5322 1000.13 18.6596 999.949 19.765 C 999.731 20.8965 999.044 21.8825 998.057 22.478 C 944.988 56.359 893.494 66.545 849.18 51.892 C 835.73 46.904 823.21 40.132 811.091 33.579 C 790.624 22.515 769.474 11.075 744.434 8.422 C 718.794 6.536 683.794 20.274 649.928 33.58 C 616.755 46.612 582.706 59.992 554.481 59.992",
	terrain:
		"M 199.857 60.002 C 191.268 60.0299 182.716 58.8781 174.441 56.579 C 152.641 50.489 132.927 29.879 121.985 10.906 C 110.9 15.215 99.826 19.891 89.085 24.438 C 62.599 35.608 35.214 47.179 5.899 54.023 C 4.65453 54.3146 3.34511 54.0948 2.264 53.413 C 0.606469 52.3687 -0.263729 50.4327 0.055617 48.4998 C 0.374963 46.5669 1.82165 45.0137 3.727 44.558 C 32.245 37.889 59.246 26.49 85.359 15.458 C 97.435 10.358 109.926 5.083 122.469 0.31 C 124.748 -0.548323 127.308 0.432782 128.43 2.594 C 137.548 20.094 156.638 41.52 177.007 47.208 C 213.799 57.484 251.599 39.742 288.165 22.58 C 307.719 13.411 326.188 4.749 344.465 0.149 C 347.001 -0.479554 349.575 1.02941 350.265 3.549 C 355.306 21.703 364.574 33.877 378.594 40.783 C 418.908 60.636 490.461 31.002 537.816 11.396 C 547.877 7.227 557.377 3.294 565.399 0.302 C 566.66 -0.166204 568.061 -0.0801365 569.255 0.539 C 570.453 1.16066 571.338 2.25252 571.699 3.553 C 576.744 21.707 586.007 33.881 600.032 40.787 C 640.349 60.636 711.899 31.002 759.253 11.396 C 769.31 7.227 778.813 3.296 786.833 0.296 C 788.098 -0.172224 789.502 -0.0850783 790.699 0.536 C 791.899 1.15597 792.786 2.24945 793.144 3.552 C 798.013 21.211 806.991 33.116 820.588 39.935 C 859.092 59.248 926.85 32.202 971.692 14.295 C 979.635 11.127 986.992 8.186 993.52 5.762 C 994.715 5.31253 996.041 5.36298 997.199 5.902 C 998.359 6.44538 999.258 7.42517 999.699 8.628 C 1000.14 9.83913 1000.09 11.1757 999.555 12.349 C 999.022 13.5161 998.05 14.4249 996.849 14.877 C 990.387 17.277 983.108 20.188 975.237 23.335 C 926.037 42.986 858.657 69.895 816.29 48.643 C 801.709 41.328 791.332 28.755 785.406 11.237 C 778.616 13.877 770.939 17.055 762.906 20.384 C 711.043 41.867 640.006 71.3 595.806 49.527 C 580.772 42.115 570.084 29.251 563.98 11.237 C 557.189 13.877 549.508 17.055 541.472 20.384 C 489.599 41.866 418.546 71.289 374.374 49.526 C 359.212 42.06 348.468 29.034 342.392 10.762 C 326.364 15.384 309.742 23.184 292.226 31.394 C 262.156 45.508 231.267 60.002 199.855 60.002",
	stack: "M 694.382 59.998 C 676.359 59.998 663.12 46.341 651 33.836 C 645.085 27.736 639.5 21.972 633.469 17.653 C 608.742 -0.071 593.111 13.726 573.338 31.191 C 557.846 44.873 540.272 60.374 516.73 56.939 C 499.252 54.399 485.607 42.528 472.421 31.046 C 451.313 12.692 434.657 -1.838 407.634 23.863 C 404.348 27.1129 401.23 30.529 398.293 34.098 C 390.593 43.11 382.641 52.427 369.85 57.018 C 351.593 63.563 332.406 58.093 315.857 41.56 C 313.017 38.729 310.337 35.7 307.668 32.66 C 299.362 23.266 291.514 14.378 278.51 11.216 C 264.491 7.806 251.957 12.001 237.874 24.805 C 234.949 27.471 232.034 30.52 228.949 33.755 C 217.781 45.455 205.108 58.712 185.449 59.667 C 163.957 60.678 149.849 45.588 138.46 33.435 C 136.154 30.976 133.901 28.578 131.691 26.418 C 112.54 7.681 90.31 6.027 70.676 21.911 C 66.982 24.897 63.245 28.525 59.284 32.369 C 45.585 45.68 28.545 62.255 3.935 57.828 C 2.69967 57.6274 1.59635 56.9399 0.871987 55.9193 C 0.147623 54.8987 -0.137297 53.6303 0.081 52.398 C 0.622238 49.8292 3.12211 48.168 5.7 48.664 C 25.292 52.144 39.108 38.764 52.464 25.787 C 56.586 21.798 60.472 18.015 64.497 14.76 C 87.741 -4.059 116.108 -2.085 138.54 19.855 C 140.846 22.118 143.195 24.609 145.587 27.172 C 156.67 38.972 168.2 51.15 184.974 50.358 C 200.711 49.589 211.474 38.323 221.883 27.431 C 225.076 24.073 228.107 20.91 231.29 18.016 C 241.678 8.56 258.11 -3.366 280.851 2.174 C 296.845 6.074 306.069 16.507 314.984 26.614 C 317.536 29.497 320.066 32.37 322.778 35.068 C 332.483 44.768 347.943 54.928 366.5 48.276 C 376.867 44.556 383.668 36.587 390.875 28.154 C 394.02 24.337 397.363 20.6873 400.89 17.22 C 434.34 -14.62 458 5.966 478.862 24.12 C 490.99 34.671 503.546 45.595 518.162 47.72 C 537.177 50.476 551.591 37.765 566.848 24.313 C 586.193 7.24 608.123 -12.102 639.192 10.153 C 645.929 14.989 652.079 21.324 658.015 27.453 C 675.066 45.042 689.779 60.221 716.257 42.83 C 722.357 38.821 728.344 33.012 734.674 26.853 C 752.483 9.563 774.626 -11.973 806.645 8.053 C 814.573 13.003 821.745 20.268 828.674 27.296 C 846.491 45.361 861.882 60.963 887.938 41.309 C 893.111 37.409 897.611 32.494 902.376 27.296 C 911.945 16.858 921.826 6.069 938.154 2.566 C 967.11 -3.653 990.3 19.403 998.916 29.613 C 999.721 30.5638 1000.1 31.8024 999.973 33.0417 C 999.843 34.2809 999.212 35.4132 998.227 36.176 C 997.228 36.9631 995.962 37.3323 994.696 37.206 C 993.436 37.0854 992.273 36.4788 991.453 35.515 C 983.974 26.638 964.035 6.558 940.244 11.674 C 926.959 14.526 918.527 23.734 909.583 33.489 C 904.73 38.78 899.726 44.247 893.856 48.67 C 860.937 73.493 839.18 51.45 821.708 33.737 C 814.853 26.792 808.383 20.237 801.425 15.879 C 775.962 -0.046 759.231 16.22 741.497 33.437 C 735.113 39.627 728.525 46.037 721.66 50.544 C 711.4 57.287 702.42 59.998 694.38 59.998",
};

class WaveDrawer {
	waveCount = 5;
	gap = 20;
	constructor() {
		const canvas = document.createElement("canvas");
		this.canvas = canvas;
		this.ctx = canvas.getContext("2d");
	}

	draw(props = {}) {
		Object.assign(this, props);

		const snug = this.style == "compact";
		this.waveCount = snug ? 5 : 3;
		this.gap = snug ? 20 : 60;

		this.canvas.width = 1000;
		this.canvas.height = (60 + this.gap) * this.waveCount - this.gap;

		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		return this.drawImage();
	}

	drawImage() {
		const ctx = this.ctx;
		const wave = new Path2D(waveThreads[this.wave]);
		ctx.fillStyle = this.color;

		Array(this.waveCount)
			.fill("a")
			.forEach((_, i) => {
				ctx.save();
				ctx.translate(0, i * (60 + this.gap));
				ctx.fill(wave);
				ctx.restore();
			});

		const res = this.canvas.toDataURL();

		showPreview(res);

		return res;
	}
}

function WaveComponent() {
	const [data, updateField] = useDataSchema("waves", {
		color: "#28a745",
		style: "compact",
	});

	return (
		<>
			<div className="px-12px">
				<ComponentFields
					schema={{
						color: {
							type: "color",
							meta: {
								singleChoice: true,
								choiceSize: 30,
							},
						},
						style: {
							type: "card",
							choices: ["compact", "loose"],
							meta: {
								transparent: true,
								renderChoice(style) {
									const url = new WaveDrawer().draw({
										wave: "sine",
										color: "black",
										style,
									});

									return (
										<img
											className="bg-gray p-1 h-full"
											src={url}
										/>
									);
								},
							},
						},
						wave: {
							type: "grid",
							label: "",
							hint: "Click or drag and drop a wave to add it to your canvas",
							choices: Object.keys(waveThreads),
							noBorder: true,
							meta: {
								columns: 2,
								aspectRatio: "2/1.2",
								render(wave) {
									const url = new WaveDrawer().draw({
										...data,
										wave,
									});

									return (
										<DraggableImage
											className="p-2 w-full"
											onClickOrDrag={() =>
												updateField({ wave })
											}
											src={url}
											style={{
												filter: "drop-shadow(0.5px 0.5px 0.5px rgba(0, 0, 0, 0.4))",
											}}
										/>
									);
								},
							},
						},
					}}
					onChange={updateField}
					data={data}
				/>
			</div>
		</>
	);
}

WaveComponent.usePreview = () => {
	const [preview, setPreview] = useState();
	const [data] = useDataSchema("waves", {
		wave: "beach",
		color: "#28a745",
		style: "compact",
	});

	const handleQuickAction = (e) => {
		e.stopPropagation();

		addToDocument(preview);
	};

	useEffect(() => {
		if (preview) return;

		setPreview(new WaveDrawer().draw(data));
	}, []);

	const quickAction = (children) => (
		<button
			className="flex items-center cursor-pointer bg-transparent border border-transparent p-0"
			onClick={handleQuickAction}
		>
			{children("Add to canvas")}
		</button>
	);

	return {
		quickAction,
		preview,
	};
};

export default WaveComponent;
