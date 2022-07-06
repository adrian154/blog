This article aims to be a comprehensive guide for constructing a confidence interval.

# One-Sample Interval for Proportions

The 1-PropZInt is used when you have one sample of proportional data. Here's an example from the [2017 AP Stats FRQ](https://apcentral.collegeboard.org/pdf/ap-statistics-frq-2017.pdf):

> The manager [of a local fast-food restaurant] selected a sample of 80 customers who asked for a water cup when placing an order and found that 23 of those customers filled the cup with a soft drink from the beverage fountain. Construct and interpret a 95 percent confidence interval for the proportion of all customers who, having asked for a water cup when placing an order, will fill the cup with a soft drink from the beverage fountain.

## Define the Quantity 

**Example:** Let $\pi$ be the true proportion of customers who will use a water cup for soft drinks.

## Check the Conditions

For 1-PropZInts, you must make sure that two things are true:
* The sample must be randomly selected from the population.
* Each outcome must occur more than 10 times ($n\pi \geq 10$ and $n(1-\pi) \geq 10$).

**Example:** 
* It is stated that the sample was randomly selected.
* $n\pi = 23 \geq 10$ and $n(1-\pi) = 57 \geq 10$

## Do the Math

The endpoints of the confidence interval are given by the following formula:

$$p \pm z_\text{crit} \sqrt{\frac{p(1-p)}{n}}$$

<aside>

To determine the value of $z_\text{crit}$, use invNorm to determine the $z$-score that has an area of $\frac{1 - \alpha}{2}$ to the left/right of it.

</aside>

**Example:**

$$p \pm z_\text{crit} \sqrt{\frac{p(1-p)}{n}} = 0.2875 \pm 1.96 \sqrt{\frac{0.2875(1-0.2875)}{80}} \\ = \{0.1883, 0.3867\}$$

## Interpret the Results

**Example:** I am 95% confident that the true proportion of customers who use water cups for soft drinks is between 18.83% and 38.67%.

## Necessary Sample Count

For a hypothesized proportion $\pi$, the number of samples necessary to estimate $\pi$ to an interval of width $B$ is given by:

$$n = \pi(1-\pi)\left(\frac{z_\text{crit}}{B}\right)^2$$

# Two-Sample Interval for Proportions

The 2-PropZInt is used to compare proportions drawn from two samples; it produces a range of values for the true difference between two proportions. It is very similar to the 1-PropZInt, with a few key differences:

* You must explicitly check the conditions for **both** samples.
* The endpoints of the interval are given by the following formula:

$$(p_1 - p_2) \pm z_\text{crit} \sqrt{\frac{p_1(1-p_1)}{n_1} + \frac{p_2(1-p_2)}{n_2}}$$

# One-Sample Interval for the Mean

If the population standard deviation ($\sigma$) is given, the 1-SampZInt can be used to perform a confidence interval for the mean. However, the poplation SD is usually not available; in that case, you'll need to use a 1-SampTInt to estimate the population mean based on the sample mean and sample SD ($s$).

Here's an example of what a problem asking you to perform a one-sample $t$-interval might look like.

> Adrian wanted to know what his test average in AP Stats was, so he picked five random tests. (Dr. Fry went crazy and had the class take a test every day, so the population size is much larger than 50). He found that his mean score was 75%, with a standard deviation of 8 points. Construct a 95% confidence interval for Adrian's true mean test score. You may assume that the population is normally distributed.

## Define the Quantity

**Example:** Let $\mu$ be Adrian's true mean test score.

## Check the Conditions

Three conditions must be met for $t$-intervals of the mean:
* The sample was randomly selected.
* If $n \geq 30$, the Central Limit Theorem states that the **sampling distribution** will be normal. However, if $n < 30$, you must check whether the **population** is normally distributed. This can be done by drawing a boxplot of the data and determining whether there is excessive skew. If the datapoints are not provided, you have no choice but to assume that the population is normally distributed.
* $n$ is less than 10% of the population size.

**Example:**
* It is stated that the sample was randomly selected.
* $n$ is less than 10% of the population size.
* The question states that we may assume the population is normally distributed.

## Do the Math

The endpoints of the confidence interval are given by the following formula:

$$\bar{x} \pm t_\text{crit} \left(\frac{s}{\sqrt{n}}\right)$$

<aside>

$t_\text{crit}$ is calculated similarly to $z_\text{crit}$; use $\text{df} = n - 1$.

</aside>

**Example:**

$$\bar{x} \pm t_\text{crit} \left(\frac{s}{\sqrt{n}}\right) = 75 \pm 1.96 \times \left(\frac{8}{\sqrt{10}}\right) \\ = \{70.0415, 79.9585\}$$

## Interpret the Results

**Example:** I am 95% confident that Adrian's true mean test score is between 70.0415 and 79.9585.

## Necessary Sample Count

The number of samples to estimate $\mu$ within $B$ units at a certain confidence level is given by the following formula:

$$n = \left(\frac{z_\text{crit}\sigma}{B}\right)^2$$

Since population SD $\sigma$ is usually unknown, it can be approximated as $\frac{\text{range}}{4}$.

# Two-Sample Interval for the Mean

Again, two-sample intervals for the mean are very similar to their one-sample counterparts. However, there are a few key differences:

* You need to check **all** the conditions for both samples.
* The endpoints of the interval are given by the following formula:

$$\bar{x}_1 - \bar{x}_2 \pm t_\text{crit} \sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}$$

* The value of $\text{df}$ is given by a really messy formula that you aren't asked to memorize. I suggest running the interval with your calculator first and writing down the value.

Let's do an example. Here's a problem from the [2009 AP Stats FRQ](https://secure-media.collegeboard.org/apc/ap09_frq_statistics.pdf):

> One of the two fire stations in a certain town responds to calls in the northern half of the town, and the other fire station responds to calls in the southern half of the town. One of the town council members believes that the two fire stations have different mean response times.

> Data were collected to investigate whether the council member’s belief is correct. A random sample of 50 calls selected from the northern fire station had a mean response time of 4.3 minutes with a standard deviation of 3.7 minutes. A random sample of 50 calls selected from the southern fire station had a mean response time of 5.3 minutes with a standard deviation of 3.2 minutes. Construct and interpret a 95 percent confidence interval for the difference in mean response times between the two fire stations.

**State the quantity:** Let $\mu_1$ be the true mean response time of the northern fire station and $\mu_2$ be the true mean response time of the southern fire station.

**Check the conditions:** For the northern fire station:
* It is stated that the sample was randomly selected.
* $n > 30$; the Central Limit Theorem states that the sampling distribution will be normal.
* $n$ is less than 10% of the population.

For the southern fire station:
* It is stated that the sample was randomly selected.
* $n > 30$; the Central Limit Theorem states that the sampling distribution will be normal.
* $n$ is less than 10% of the population.

<aside>

Don't get lazy! You need to explicitly state that the conditions are met for both samples. Check out the [scoring guidelines](https://secure-media.collegeboard.org/apc/ap09_statistics_sgs.pdf) for more info on what exactly is expected.

</aside>

**Do the math:** 

$$\bar{x}_1 - \bar{x}_2 \pm t_\text{crit} \sqrt{\frac{s_1^2}{n_1} + \frac{s_2^2}{n_2}}$$

$$4.3 - 5.3 \pm 1.985 \sqrt{\frac{3.7^2}{50} + \frac{3.2^2}{50}} = \{-2.37, 0.37\}$$

**Interpret the results:** I am 95% confident that the northern fire station is between 2.37 and -0.37 minutes faster in response time than the southern fire station.

# Paired Intervals for the Mean

When the samples are *paired*, it means that the samples in each group are linked together somehow. For example, if I measured the resting heart rate of 10 subjects, made them do some exercise, and then measured their heartrate afterwards, the samples are paired because the measurements came from the same set of people. In this situation, instead of using a 2-sample interval, we can simply conduct a one-sample $t$-interval on the **difference** between each subject's heartrate before and after they did exercise.

# Linear Regression t-intervals

It turns out that the sampling distribution for the slope of linearly distributed data is $t$-distributed, so we can use a $t$-interval to find the probable range of slopes for a linear model. How exciting.

Here's the problem from the linreg $t$-interval worksheet:

> Suppose these house sales were recently recorded in Fremont. Dr. Fry would like to predict house price based on size. Here is the data:

<div style="text-align: center">

| house size (ft.<sup>2</sup>) | price ($1,000s) |
|------|-----|
| 1580 | 479 |
| 1610 | 521 |
| 1700 | 545 |
| 1790 | 610 |
| 1880 | 635 |
| 1620 | 491 |
| 1700 | 512 |
| 1750 | 540 |
| 1820 | 670 |
| 1890 | 680 |

</div>

## Define the Quantity

**Example:** Let $\beta$ be the true slope of the relationship between house size and price.

## Check the Conditions

Four conditions must be met for linreg $t$-intervals:
* The sum of the residuals is zero.
* The standard deviation of the slope ($\sigma_e$) is independent of $x$.
* The residuals are approximately normally distributed.
* The residuals are independent of each other.

You don't have to rigorously prove that each one is true, just state the conditions.

## Do the Math

The first thing we do is immediately input all the data into our calculator and run a LinRegTInt, which yields our interval: $\{0.4193, 0.8245\}$

## Interpret the Results

**Example:** I am 95% confident that the true slope of the relationship between house area and price is between 0.4193 and 0.8245.

# Epilogue

If you found this resource helpful, I'm planning on making one for hypothesis tests soon!