# Stats Formulas

Compiled by Adrian. I CANNOT GUARANTEE ACCURACY, USE AT YOUR OWN PERIL.

## One-Sample Confidence Intervals

*z*-interval for proportions:

`$$p \pm z_\text{crit} \sqrt{\frac{p(1-p)}{n}}$$`

Minimum sample size for *z*-interval for proportion tests at a given confidence level:

`$$n = \pi(1 - \pi)\left(\frac{z_\text{crit}}{B}\right)^2$$`

*z*-interval for sample means:

`$$\bar{x} \pm z_\text{crit}\frac{\sigma}{\sqrt{n}}$$`

*t*-interval for sample means:

`$$\bar{x} \pm t_\text{crit}\frac{s}{\sqrt{n}}$$`

Minimum sample size for *z*-interval for sample tests at a given confidence level:

`$$n = \left(\frac{z_\text{crit}\sigma}{B}\right)$$`

## One-Sample Hypothesis Tests

*z*-statistic for proportions:

`$$z = \frac{p - H_0}{\sqrt{\frac{H_0(1-H_0)}{n}}}$$`

*z*-statistic for means:

`$$z = \frac{x - H_0}{\frac{\sigma}{\sqrt{n}}}$$`

*t*-statistic for means:

`$$t = \frac{x - H_0}{\frac{s}{\sqrt{n}}}$$`

## Two-Sample Hypothesis Tests 

*t*-statistic for means:

`$$t = \frac{\bar{x}_1 - \bar{x}_2 - H_0}{\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}}$$`

## Two-Sample Confidence Intervals

*t*-interval for means:

`$$(\bar{x}_1 - \bar{x}_2) \pm t_\text{crit}\sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}$$`

## Assumptions

* If the population SD is known, use a *z*-based method. Otherwise, use a *t*-based method.
* The sample must be an SRS.
* *n* must be less than 10% of the population.
* For sample means:
    * If *n* < 30, draw a boxplot of the data and determine whether the **population** can be treated as normally distributed. If datapoints are not available, assume that the population is normally distributed.
    * If *n* > 30, the Central Limit Theorem says that the sampling distribution should be normal.
* For proportions: 
    * *n*&times;&pi; &geq; 10 and *n*&times;(1-&pi;) &geq; 10